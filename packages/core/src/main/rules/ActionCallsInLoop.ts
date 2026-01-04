import { FlowType, IRuleDefinition } from "../internals/internals";
import { LoopRuleCommon } from "../models/LoopRuleCommon";
export class ActionCallsInLoop extends LoopRuleCommon implements IRuleDefinition {
  constructor() {
    super(
      {
        ruleId: "action-call-in-loop",
        category: "suggestion",
        description: "Repeatedly invoking Apex actions inside a loop can exhaust governor limits and lead to performance issues. Where possible, bulkify your logic by moving the action call outside the loop and passing a collection variable instead.",
        summary: "Action calls inside loop risk governor limits",
        docRefs: [
          {
            label: "Action Call In A Loop",
            path: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation_InvocableMethod.htm",
          },
        ],
        label: "Action Call In A Loop",
        name: "ActionCallsInLoop",
        supportedTypes: FlowType.backEndTypes,
      }, { severity: "warning" });
  }
  protected getStatementTypes(): string[] {
    return ["actionCalls", "apexPluginCalls"];
  }
}