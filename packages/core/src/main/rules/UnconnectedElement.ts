import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
export class UnconnectedElement extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "unreachable-element",
      description: "Avoid unconnected elements that are not used by the flow to keep flows efficient and maintainable.",
      docRefs: [],
      label: "Unreachable Element",
      name: "UnconnectedElement",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
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