import { AdvancedConfig } from "../interfaces/AdvancedRuleConfig";
import { AdvancedSuppression } from "../interfaces/AdvancedSuppression";
import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class MissingFaultPath
  extends AdvancedRule
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
      suppressionElement: "actionName",
    });
  }

  private isValidSubtype(proxyNode: core.FlowNode): boolean {
    if (!this.applicableElements.includes(proxyNode.subtype)) {
      return false;
    }

    if (proxyNode.subtype === "waits") {
      const elementSubtype: string = (proxyNode.element as Record<string, unknown>)?.["elementSubtype"] as string;
      const excludedSubtypes: string[] = ["WaitDuration", "WaitDate"];
      return !excludedSubtypes.includes(elementSubtype);
    }

    return true;
  }

  public execute(flow: core.Flow): core.RuleResult {
    const compiler = new core.Compiler();
    const results: core.ResultDetails[] = [];
    const elementsWhereFaultPathIsApplicable = (
      flow.elements?.filter((node) => {
        const proxyNode = node as unknown as core.FlowNode;
        return this.isValidSubtype(proxyNode);
      }) as core.FlowNode[]
    ).map((e) => e.name);

    const isRecordBeforeSave = flow.start.triggerType === "RecordBeforeSave";

    const visitCallback = (element: core.FlowNode) => {
      if (
        !element?.connectors?.find((connector) => connector.type === "faultConnector") &&
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
    const suppressionElementKey = this.suppressionElement as string;
    for (const resultDetails of scanResult.details) {
      if (
        "violation" in resultDetails &&
        "element" in resultDetails.violation &&
        typeof resultDetails.violation.element === "object" &&
        !Array.isArray(resultDetails.violation.element) &&
        suppressionElementKey in resultDetails.violation.element &&
        ruleConfiguration?.suppressions?.includes(
          (resultDetails.violation.element as { actionName: string })[
            suppressionElementKey
          ] as string
        )
      ) {
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
          otherElement.connectors?.find(
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
