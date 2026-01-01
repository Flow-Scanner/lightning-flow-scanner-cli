import { FlowType, IRuleDefinition } from "../internals/internals";
import { LoopRuleCommon } from "../models/LoopRuleCommon";
export class ActionCallsInLoop extends LoopRuleCommon implements IRuleDefinition {
  constructor() {
    super(
      {
        ruleId: "action-call-in-loop",
        description: "To prevent exceeding Apex governor limits, it is advisable to consolidate and bulkify your apex calls, utilizing a single action call containing a collection variable at the end of the loop.",
        docRefs: [
          {
            label: "Action Call In A Loop",
            path: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation_InvocableMethod.htm",
          },
        ],
        label: "Action Call In A Loop",
        name: "ActionCallsInLoop",
        supportedTypes: FlowType.backEndTypes,
      }, { severity: "error" });
  }
  protected getStatementTypes(): string[] {
    return ["actionCalls", "apexPluginCalls"];
  }
}