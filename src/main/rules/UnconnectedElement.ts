import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class UnconnectedElement extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      autoFixable: true,
      description:
        "To maintain the efficiency and manageability of your Flow, it's best to avoid including unconnected elements that are not in use.",
      docRefs: [],
      isConfigurable: false,
      label: "Unconnected Element",
      name: "UnconnectedElement",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
    });
  }

  public execute(
    flow: core.Flow,
    options?: object,
    suppressions: string[] = []
  ): core.RuleResult {
    const suppSet = new Set(suppressions);
    const connectedElements: Set<string> = new Set<string>();

    const logConnected = (element: core.FlowNode) => {
      connectedElements.add(element.name);
    };

    const flowElements: core.FlowNode[] = flow.elements!.filter(
      (node) => node instanceof core.FlowNode
    ) as core.FlowNode[];

    const startIndex = this.findStart(flowElements);

    if (startIndex !== -1) {
      new core.Compiler().traverseFlow(flow, flowElements[startIndex].name, logConnected);
    }

    const unconnectedElements: core.FlowNode[] = flowElements.filter(
      (element) => !connectedElements.has(element.name) && !suppSet.has(element.name)
    );

    const results = unconnectedElements.map((det) => new core.ResultDetails(det));
    return new core.RuleResult(this, results);
  }

  private findStart(nodes: core.FlowNode[]) {
    return nodes.findIndex((n) => {
      return n.subtype === "start";
    });
  }
}