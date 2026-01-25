import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { Flow, FlowNode, Violation } from "../internals/internals";
import { SubflowResolver } from "../libs/SubflowResolver";
import { RuleCommon } from "./RuleCommon";
import { RuleInfo } from "./RuleInfo";

interface LoopRuleOptions {
  subflowResolver?: SubflowResolver;
  [key: string]: unknown;
}

interface SubflowViolation {
  /** The subflow node in the parent flow (inside the loop) */
  subflowNode: FlowNode;
  /** The actual violating node in the child flow */
  violatingNode: FlowNode;
  /** The resolved child flow containing the violation */
  childFlow: Flow;
  /** For nested subflows: the chain of flow names from loop to violation */
  callChain?: string[];
}

export abstract class LoopRuleCommon extends RuleCommon implements IRuleDefinition {
  // Cache for resolved subflows during a single check
  private resolvedSubflows: Map<string, Flow | undefined> = new Map();

  constructor(info: RuleInfo, optional?: { severity?: string }) {
    super(info, optional);
  }

  protected check(
    flow: Flow,
    options: LoopRuleOptions | undefined,
    suppressions: Set<string>
  ): Violation[] {
    // Clear cache for each flow check
    this.resolvedSubflows.clear();

    const loopElements = flow.graph.getLoopNodes();
    if (!loopElements.length) {
      return [];
    }

    const results: Violation[] = [];

    // Find direct statements in loops
    const statementsInLoops = this.findStatementsInLoops(flow, loopElements);
    for (const node of statementsInLoops) {
      if (!suppressions.has(node.name)) {
        results.push(new Violation(node));
      }
    }

    // Find statements in subflows called from loops (if resolver provided)
    if (options?.subflowResolver) {
      const subflowViolations = this.findStatementsInSubflowsSync(
        flow,
        loopElements,
        options.subflowResolver
      );
      for (const sv of subflowViolations) {
        // Check suppression on the subflow call node (not the internal node)
        if (!suppressions.has(sv.subflowNode.name)) {
          // Create violation on the subflow node with details about the internal issue
          const violation = new Violation(sv.subflowNode);
          violation.details = {
            ...violation.details,
            subflowName: sv.childFlow.name,
            subflowViolatingElement: sv.violatingNode.name,
            subflowViolatingType: sv.violatingNode.subtype,
            // Include call chain for nested subflows (e.g., ["FlowA", "FlowB", "FlowC"])
            ...(sv.callChain ? { subflowCallChain: sv.callChain } : {}),
          };
          results.push(violation);
        }
      }
    }

    return results;
  }

  protected abstract getStatementTypes(): string[];

  private findLoopElements(flow: Flow): FlowNode[] {
    return flow.graph.getLoopNodes();
  }

  private findLoopEnd(element: FlowNode): string {
    return (element.element as any)?.noMoreValuesConnector?.targetReference ?? element.name;
  }

  private findStatementsInLoops(flow: Flow, loopElements: FlowNode[]): FlowNode[] {
    const statementsInLoops: FlowNode[] = [];
    const statementTypes = this.getStatementTypes();
    for (const element of loopElements) {
      const loopElems = flow.graph.getLoopElements(element.name);
      for (const elemName of loopElems) {
        const node = flow.graph.getNode(elemName);
        if (node && statementTypes.includes(node.subtype)) {
          statementsInLoops.push(node);
        }
      }
    }
    return statementsInLoops;
  }

  /**
   * Find subflows called from within loops and check if they contain violating statements.
   * Recursively checks nested subflow chains.
   * Uses synchronous resolution via getSync().
   */
  private findStatementsInSubflowsSync(
    flow: Flow,
    loopElements: FlowNode[],
    resolver: SubflowResolver
  ): SubflowViolation[] {
    const violations: SubflowViolation[] = [];

    // Check if resolver supports synchronous access
    if (!resolver.getSync) {
      return violations;
    }

    for (const loopElement of loopElements) {
      const loopElems = flow.graph.getLoopElements(loopElement.name);

      for (const elemName of loopElems) {
        const node = flow.graph.getNode(elemName);
        if (!node || node.subtype !== "subflows") continue;

        const subflowName = node.flowName;
        if (!subflowName) continue;

        // Recursively find violations in this subflow and its children
        const subflowViolations = this.findViolationsInSubflowRecursive(
          subflowName,
          node,
          resolver,
          new Set<string>() // Track visited flows to prevent infinite loops
        );

        violations.push(...subflowViolations);
      }
    }

    return violations;
  }

  /**
   * Recursively check a subflow (and its nested subflows) for violating statements.
   * @param subflowName - The API name of the subflow to check
   * @param originalSubflowNode - The original subflow node in the parent flow (for reporting)
   * @param resolver - The subflow resolver
   * @param visited - Set of already-visited flow names to prevent cycles
   * @param callChain - Optional chain of flow names for detailed reporting
   */
  private findViolationsInSubflowRecursive(
    subflowName: string,
    originalSubflowNode: FlowNode,
    resolver: SubflowResolver,
    visited: Set<string>,
    callChain: string[] = []
  ): SubflowViolation[] {
    const violations: SubflowViolation[] = [];
    const statementTypes = this.getStatementTypes();

    // Prevent infinite recursion from circular subflow references
    if (visited.has(subflowName)) {
      return violations;
    }
    visited.add(subflowName);

    // Check if resolver has this flow
    if (!resolver.has(subflowName)) {
      return violations;
    }

    // Get from cache or resolve synchronously
    let childFlow = this.resolvedSubflows.get(subflowName);
    if (childFlow === undefined && !this.resolvedSubflows.has(subflowName)) {
      childFlow = resolver.getSync!(subflowName);
      this.resolvedSubflows.set(subflowName, childFlow);
    }

    if (!childFlow) {
      return violations;
    }

    const currentChain = [...callChain, subflowName];

    // Check all elements in the child flow
    for (const childElement of childFlow.elements) {
      if (!(childElement instanceof FlowNode)) continue;

      // Check for direct violations
      if (statementTypes.includes(childElement.subtype)) {
        violations.push({
          subflowNode: originalSubflowNode,
          violatingNode: childElement,
          childFlow: childFlow,
          callChain: currentChain.length > 1 ? currentChain : undefined,
        });
      }

      // Recursively check nested subflows
      if (childElement.subtype === "subflows" && childElement.flowName) {
        const nestedViolations = this.findViolationsInSubflowRecursive(
          childElement.flowName,
          originalSubflowNode, // Keep reporting on the original subflow call
          resolver,
          visited,
          currentChain
        );
        violations.push(...nestedViolations);
      }
    }

    return violations;
  }
}