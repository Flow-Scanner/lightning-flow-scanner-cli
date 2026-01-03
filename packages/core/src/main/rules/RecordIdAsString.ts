import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class RecordIdAsString extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "record-id-as-string",
      name: "RecordIdAsString",
      label: "Record ID as String",
      description: "Flows that use a String variable for a record ID instead of receiving the full record introduce unnecessary complexity and additional Get Records queries. Using the complete record simplifies the Flow and improves performance.",
      supportedTypes: [
        ...core.FlowType.visualTypes,
        core.FlowType.autolaunchedType,
      ],
      docRefs: [
        {
          label: "Screen Flow Distribution",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_distribute_screen.htm",
        },
      ],
    }, { severity: "note" });
  }

  protected check(
  flow: core.Flow,
  _options: object | undefined,
  _suppressions: Set<string>
): core.Violation[] {
  const violations: core.Violation[] = [];

  // Skip record-triggered flows - they don't support this pattern
  const triggerType = this.getStartProperty(flow, 'triggerType');
  const isRecordTriggered = 
    triggerType === "RecordAfterSave" || 
    triggerType === "RecordBeforeDelete" || 
    triggerType === "RecordBeforeSave";

  if (isRecordTriggered) {
    return violations;
  }

  // Find input variables named "recordId" (case-insensitive)
  const variables = flow.elements?.filter(
    (e) => e.subtype === "variables"
  ) as core.FlowVariable[];

  for (const variable of variables) {
    const varElement = variable.element as any;
    
    if (
      (varElement.isInput === true || varElement.isInput === "true") &&
      variable.name.toLowerCase() === "recordid" &&
      varElement.dataType === "String"
    ) {
      violations.push(new core.Violation(variable));
    }
  }

  return violations;
}
}