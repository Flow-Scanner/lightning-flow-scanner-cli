import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class MissingFaultPath extends RuleCommon implements IRuleDefinition {
  protected applicableElements: string[] = [
    "recordLookups",
    "recordDeletes",
    "recordUpdates",
    "recordCreates",
    "waits",
    "actionCalls",
    "apexPluginCalls",
  ];

  constructor() {
    super({
      ruleId: "missing-fault-path",
      description: "Elements that can fail should include a Fault Path to handle errors gracefully. Without it, failures show generic errors to users. Fault Paths improve reliability and user experience.",
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
      ],
      label: "Missing Fault Path",
      name: "MissingFaultPath",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
    });
  }

  private isValidSubtype(proxyNode: core.FlowNode): boolean {
    if (!this.applicableElements.includes(proxyNode.subtype)) {
      return false;
    }
    
    // Exclude specific wait element subtypes that don't need fault paths
    if (proxyNode.subtype === "waits") {
      const elementSubtype: string = (proxyNode.element as Record<string, unknown>)?.["elementSubtype"] as string;
      const excludedSubtypes: string[] = ["WaitDuration", "WaitDate"];
      return !excludedSubtypes.includes(elementSubtype);
    }
    
    return true;
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    suppressions: Set<string>
  ): core.Violation[] {
    const results: core.Violation[] = [];
    
    const elementsWhereFaultPathIsApplicable = (
      flow.elements.filter((node) => {
        const proxyNode = node as unknown as core.FlowNode;
        return this.isValidSubtype(proxyNode);
      }) as core.FlowNode[]
    ).map((e) => e.name);

    // Check if this is a RecordBeforeSave flow
    const isRecordBeforeSave = this.isRecordBeforeSaveFlow(flow);

    const visitCallback = (element: core.FlowNode) => {
      if (
        !element?.connectors?.find((connector) => connector.type === "faultConnector") &&
        elementsWhereFaultPathIsApplicable.includes(element.name)
      ) {
        // Skip record updates in before-save flows (they're safe by design)
        if (isRecordBeforeSave && element.subtype === "recordUpdates") {
          return;
        }
        
        if (!this.isPartOfFaultHandlingFlow(element, flow)) {
          if (!suppressions.has(element.name)) {
            results.push(new core.Violation(element));
          }
        }
      }
    };

    flow.graph?.forEachReachable(visitCallback);

    return results;
  }

  /**
   *  Determine if this is a RecordBeforeSave flow.
   */
  private isRecordBeforeSaveFlow(flow: core.Flow): boolean {
    if (flow.startNode?.element) {
      const triggerType = (flow.startNode.element as Record<string, unknown>)?.["triggerType"];
      if (triggerType === "RecordBeforeSave") {
        return true;
      }
    }
    return false;
  }

  private isPartOfFaultHandlingFlow(element: core.FlowNode, flow: core.Flow): boolean {
    return flow.graph?.isPartOfFaultHandling(element.name) || false;
  }
}