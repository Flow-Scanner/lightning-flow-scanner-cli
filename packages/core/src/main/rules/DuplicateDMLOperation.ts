import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class DuplicateDMLOperation extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "duplicate-dml",
      name: "DuplicateDMLOperation",
      label: "Duplicate DML Operation",
      description:
        "When the flow executes database changes between screens, users must not be allowed to navigate back, or duplicate DML operations may occur.",
      supportedTypes: core.FlowType.visualTypes,
      docRefs: [],
    });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    suppressions: Set<string>
  ): core.Violation[] {
    const graph = flow.graph;
    const start = flow.startReference;

    if (!start) return [];

    const violations: core.Violation[] = [];
    const visited = new Set<string>();

    type State = { name: string; seenDML: boolean };

    const stack: State[] = [{ name: start, seenDML: false }];

    while (stack.length > 0) {
      const { name, seenDML } = stack.pop()!;
      const stateKey = `${name}:${seenDML}`;

      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      const node = graph.getNode(name);
      if (!node) continue;

      let nextSeenDML = seenDML || this.isDML(node);

      if (
        nextSeenDML &&
        node.subtype === "screens" &&
        node.element["allowBack"] === "true" &&
        node.element["showFooter"] === "true" &&
        !suppressions.has(node.name)
      ) {
        violations.push(new core.Violation(node));
        // Note: do NOT return early; multiple violations possible
      }

      // Reset DML flag after screen with back disabled
      if (
        nextSeenDML &&
        node.subtype === "screens" &&
        node.element["allowBack"] !== "true"
      ) {
        nextSeenDML = false;
      }

      for (const next of graph.getNextElements(name)) {
        stack.push({ name: next, seenDML: nextSeenDML });
      }
    }

    return violations;
  }

  private isDML(node: core.FlowNode): boolean {
    return (
      node.subtype === "recordCreates" ||
      node.subtype === "recordUpdates" ||
      node.subtype === "recordDeletes"
    );
  }
}
