import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class UnconnectedElement extends AdvancedRule implements core.IRuleDefinition {
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

  public execute(flow: core.Flow): core.RuleResult {
    const connectedElements: Set<string> = new Set<string>();

    // Callback function to log connected elements
    const logConnected = (element: core.FlowNode) => {
      connectedElements.add(element.name);
    };

    // Get Traversable Nodes
    const flowElements: core.FlowNode[] = flow.elements!.filter(
      (node) => node instanceof core.FlowNode
    ) as core.FlowNode[];

    // Find start of Flow
    const startIndex = this.findStart(flowElements);

    // Start traversal from the start node
    if (startIndex !== -1) {
      new core.Compiler().traverseFlow(flow, flowElements[startIndex].name, logConnected);
    }

    const unconnectedElements: core.FlowNode[] = flowElements.filter(
      (element) => !connectedElements.has(element.name)
    );

    // Create result details
    const results = unconnectedElements.map((det) => new core.ResultDetails(det));

    return new core.RuleResult(this, results);
  }

  private findStart(nodes: core.FlowNode[]) {
    return nodes.findIndex((n) => {
      return n.subtype === "start";
    });
  }
}
