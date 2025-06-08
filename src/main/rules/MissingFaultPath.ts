import { AdvancedConfig } from "../interfaces/AdvancedRuleConfig";
import { AdvancedSuppression } from "../interfaces/AdvancedSuppression";
import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";

export class MissingFaultPath
  extends RuleCommon
  implements AdvancedSuppression, core.IRuleDefinition
{
  protected applicableElements: string[] = [
    "recordLookups",
    "recordDeletes",
    "recordUpdates",
    "recordCreates",
    "waits",
    "actionCalls",
  ];

  constructor() {
    super({
      autoFixable: false,
      description:
        "At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path.",
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
      ],
      isConfigurable: false,
      label: "Missing Fault Path",
      name: "MissingFaultPath",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
    });
  }
  public execute(flow: core.Flow): core.RuleResult {
    const compiler = new core.Compiler();
    const results: core.ResultDetails[] = [];
    const elementsWhereFaultPathIsApplicable = (
      flow.elements?.filter((node) => {
        const proxyNode = node as unknown as core.FlowNode;
        const validSubtype = this.applicableElements.includes(proxyNode.subtype);
        return validSubtype;
      }) as core.FlowNode[]
    ).map((e) => e.name);

    const isRecordBeforeSave = flow.start.triggerType === "RecordBeforeSave";

    const visitCallback = (element: core.FlowNode) => {
      if (
        !element.connectors.find((connector) => connector.type === "faultConnector") &&
        elementsWhereFaultPathIsApplicable.includes(element.name)
      ) {
        if (isRecordBeforeSave && element.subtype === "recordUpdates") {
          return;
        }
        // Check if the element is part of another fault path
        if (!this.isPartOfFaultHandlingFlow(element, flow)) {
          results.push(new core.ResultDetails(element));
        }
      }
    };

    // Use the core.Compiler for traversal
    compiler.traverseFlow(flow, flow.startReference, visitCallback);

    return new core.RuleResult(this, results);
  }

  public suppress(
    scanResult: core.RuleResult,
    ruleConfiguration?: AdvancedConfig
  ): core.RuleResult {
    const suppressedResults: core.ResultDetails[] = [];
    for (const resultDetails of scanResult.details) {
      if (ruleConfiguration?.suppressions?.includes(resultDetails.name)) {
        continue;
      }
      suppressedResults.push(resultDetails);
    }
    return new core.RuleResult(this, suppressedResults);
  }

  private isPartOfFaultHandlingFlow(element: core.FlowNode, flow: core.Flow): boolean {
    const flowelements = flow.elements?.filter(
      (el) => el instanceof core.FlowNode
    ) as core.FlowNode[];
    for (const otherElement of flowelements) {
      if (otherElement !== element) {
        // Check if the otherElement has a faultConnector pointing to element
        if (
          otherElement.connectors.find(
            (connector) =>
              connector.type === "faultConnector" && connector.reference === element.name
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
