import { FlowType, IRuleDefinition } from "../internals/internals";
import { LoopRuleCommon } from "../models/LoopRuleCommon";

export class SOQLQueryInLoop extends LoopRuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "soql-in-loop",
      description: "Running SOQL queries inside a loop can rapidly exceed query limits and severely degrade performance. Queries should be executed once, with results reused throughout the loop.",
      summary: "SOQL queries inside loop risk governor limits",
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
      ],
      label: "SOQL Query In A Loop",
      name: "SOQLQueryInLoop",
      supportedTypes: FlowType.backEndTypes,
    }, { severity: "error" });
  }

  protected getStatementTypes(): string[] {
    return ["recordLookups"];
  }
}