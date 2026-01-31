import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
export class UnconnectedElement extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "unreachable-element",
      category: "layout",
      description: "Unconnected elements never execute and add unnecessary clutter. Remove or connect unused Flow elements to keep Flows clean and efficient.",
      summary: "Unconnected elements add clutter without executing",
      docRefs: [],
      label: "Unreachable Element",
      name: "UnconnectedElement",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      isFixable: true,
    });
  }
  protected check(
    flow: core.Flow,
    _options: object | undefined,
    suppressions: Set<string>
  ): core.Violation[] {
    const connectedElements: Set<string> = flow.graph?.getReachableElements() || new Set<string>();

    const flowElements: core.FlowNode[] = flow.elements.filter(
      (node): node is core.FlowNode => node instanceof core.FlowNode
    );
    const unconnectedElements: core.FlowNode[] = flowElements.filter(
      (element) => !connectedElements.has(element.name) && !suppressions.has(element.name)
    );
    return unconnectedElements.map((det) => new core.Violation(det));
  }
}