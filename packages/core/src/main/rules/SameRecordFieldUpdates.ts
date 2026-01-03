import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class SameRecordFieldUpdates extends RuleCommon implements IRuleDefinition {
  protected qualifiedRecordTriggerTypes: Set<string> = new Set<string>([
    "Create",
    "Update",
    "CreateAndUpdate",
  ]);

  constructor() {
    super(
      {
        ruleId: "same-record-field-updates",
        name: "SameRecordFieldUpdates",
        label: "Same Record Field Updates",
        description: "Before-save Flows can safely update the triggering record directly via $Record, applying changes efficiently without extra DML operations. Using before-save updates improves performance",
        supportedTypes: [...core.FlowType.backEndTypes],
        docRefs: [
          {
            label: "Learn about same record field updates",
            path: "https://architect.salesforce.com/decision-guides/trigger-automation#Same_Record_Field_Updates",
          },
        ],
      },
      { severity: "warning" }
    );
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    const results: core.Violation[] = [];
    const triggerType = this.getStartProperty(flow, 'triggerType');
    const recordTriggerType = this.getStartProperty(flow, 'recordTriggerType');

    const isBeforeSaveType = triggerType === "RecordBeforeSave";
    const isQualifiedTriggerTypes = this.qualifiedRecordTriggerTypes.has(recordTriggerType);
    if (!isBeforeSaveType || !isQualifiedTriggerTypes) {
      return results;
    }

    const potentialElements = flow.elements?.filter(
      (node) => node.subtype === "recordUpdates"
    ) as core.FlowNode[];

    if (!potentialElements) return results;

    for (const node of potentialElements) {
      if (
        typeof node.element === "object" &&
        "inputReference" in node.element &&
        node.element.inputReference === "$Record"
      ) {
        results.push(new core.Violation(node));
      }
    }

    return results;
  }
}
