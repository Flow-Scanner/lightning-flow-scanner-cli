import { FlowType, IRuleDefinition } from "../internals/internals";
import { LoopRuleCommon } from "../models/LoopRuleCommon";

export class DMLStatementInLoop extends LoopRuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "dml-in-loop",
      description: "Executing DML operations (insert, update, delete) inside a loop is a high-risk anti-pattern that frequently causes governor limit exceptions. All database operations should be collected and executed once, outside the loop.",
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
      ],
      label: "DML Statement In A Loop",
      name: "DMLStatementInLoop",
      supportedTypes: FlowType.backEndTypes,
    }, { severity: "error" });
  }

  protected getStatementTypes(): string[] {
    return ["recordDeletes", "recordUpdates", "recordCreates"];
  }
}
