import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

/**
 * Cognitive Complexity Rule
 *
 * Unlike cyclomatic complexity which counts paths, cognitive complexity
 * measures how hard a flow is to understand by penalizing:
 * - Control flow structures (loops, decisions) +1 each
 * - Nesting depth: each level of nesting adds extra penalty
 *
 * A decision inside a loop is harder to understand than a flat sequence.
 */
export class CognitiveComplexity extends RuleCommon implements IRuleDefinition {
  private defaultThreshold: number = 15;

  constructor() {
    super(
      {
        ruleId: "cognitive-complexity",
        category: "suggestion",
        name: "CognitiveComplexity",
        label: "Cognitive Complexity",
        description: "Flows with deeply nested loops and decisions are hard to understand. Unlike cyclomatic complexity which counts paths, cognitive complexity penalizes nesting depth. Consider extracting nested logic into subflows.",
        summary: "Deeply nested logic harms readability",
        supportedTypes: core.FlowType.backEndTypes,
        docRefs: [
          {
            label: "Cognitive Complexity is a measure of how difficult code is to understand, as opposed to Cyclomatic Complexity which measures testability.",
            path: "https://www.sonarsource.com/docs/CognitiveComplexity.pdf",
          },
        ],
        configurableOptions: [
          {
            name: "threshold",
            type: "number",
            description: "Maximum cognitive complexity score before triggering a violation",
            defaultValue: 15,
          },
        ],
      },
      { severity: "note" }
    );
  }

  protected check(
    flow: core.Flow,
    options: { threshold?: number } | undefined
  ): core.Violation[] {
    const threshold = options?.threshold ?? this.defaultThreshold;
    const complexity = this.calculateCognitiveComplexity(flow);

    if (complexity > threshold) {
      return [
        new core.Violation(
          new core.FlowAttribute(
            `${complexity}`,
            "CognitiveComplexity",
            `>${threshold}`
          )
        )
      ];
    }

    return [];
  }

  /**
   * Calculate cognitive complexity for a flow.
   *
   * Algorithm:
   * 1. Find all loops and decisions
   * 2. Calculate nesting depth for each (how many loops/decisions contain it)
   * 3. Add 1 + nesting_depth for each control structure
   */
  private calculateCognitiveComplexity(flow: core.Flow): number {
    let complexity = 0;
    const graph = flow.graph;

    // Get all loops and decisions
    const loops = flow.elements.filter(e => e.subtype === "loops") as core.FlowNode[];
    const decisions = flow.elements.filter(e => e.subtype === "decisions") as core.FlowNode[];

    // Build a map of which elements are contained within which control structures
    const nestingDepth = new Map<string, number>();

    // Calculate nesting depth for each element
    for (const element of flow.elements) {
      if (!(element instanceof core.FlowNode)) continue;

      let depth = 0;

      // Check if inside any loop
      if (graph.isInLoop(element.name)) {
        depth++;
        // Check for nested loops (loop inside loop)
        const containingLoop = graph.getContainingLoop(element.name);
        if (containingLoop && containingLoop !== element.name) {
          // Check if the containing loop is itself inside another loop
          depth += this.countParentLoops(containingLoop, graph, loops);
        }
      }

      nestingDepth.set(element.name, depth);
    }

    // Add complexity for each loop: 1 + nesting depth
    for (const loop of loops) {
      const depth = nestingDepth.get(loop.name) ?? 0;
      complexity += 1 + depth;
    }

    // Add complexity for each decision: 1 + nesting depth
    // Also count additional branches beyond 2 (if-else is base, more adds complexity)
    for (const decision of decisions) {
      const depth = nestingDepth.get(decision.name) ?? 0;
      const rulesCount = decision.rules?.length ?? 0;

      // Base complexity: 1 + nesting depth
      complexity += 1 + depth;

      // Additional complexity for multiple branches (beyond binary decision)
      // Each additional rule beyond the first adds complexity
      if (rulesCount > 1) {
        complexity += rulesCount - 1;
      }
    }

    return complexity;
  }

  /**
   * Count how many parent loops contain this loop
   */
  private countParentLoops(
    loopName: string,
    graph: core.FlowGraph,
    allLoops: core.FlowNode[]
  ): number {
    let count = 0;

    for (const parentLoop of allLoops) {
      if (parentLoop.name === loopName) continue;

      // Check if loopName is within this parent loop's body
      const loopElements = graph.getLoopElements(parentLoop.name);
      if (loopElements.has(loopName)) {
        count++;
      }
    }

    return count;
  }
}
