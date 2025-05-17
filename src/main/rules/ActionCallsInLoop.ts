import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";

export class ActionCallsInLoop extends RuleCommon implements core.IRuleDefinition {
  constructor() {
    super(
      {
        autoFixable: false,
        description:
          "To prevent exceeding Apex governor limits, it is advisable to consolidate and bulkify your apex calls, utilize a single action call containing a collection variable at the end of the loop.",
        docRefs: [
          {
            label: "Flow Best Practices",
            path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
          },
        ],
        isConfigurable: false,
        label: "Action Calls In Loop",
        name: "ActionCallsInLoop",
        supportedTypes: core.FlowType.backEndTypes,
      },
      { severity: "warning" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const actionCallTypes = ["actionCalls", "apexPluginCalls"];
    const loopElements: core.FlowNode[] = flow.elements?.filter(
      (node) => node.subtype === "loops"
    ) as core.FlowNode[];

    if (!loopElements || loopElements.length === 0) {
      return new core.RuleResult(this, []);
    }

    const actionCallInLoops: core.FlowNode[] = [];

    const findActionCall = (element: core.FlowNode) => {
      if (actionCallTypes.includes(element.subtype)) {
        actionCallInLoops.push(element);
      }
    };

    for (const element of loopElements) {
      let loopEnd: string | undefined;
      // Check if 'noMoreValuesConnector' attribute exists
      if (element.element["noMoreValuesConnector"]?.targetReference) {
        loopEnd = element.element["noMoreValuesConnector"].targetReference;
      } else {
        loopEnd = element.name;
      }
      new core.Compiler().traverseFlow(flow, element.name, findActionCall, loopEnd);
    }

    const results = actionCallInLoops.map((det) => new core.ResultDetails(det));

    return new core.RuleResult(this, results);
  }
}
