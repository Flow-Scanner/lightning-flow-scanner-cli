import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class SameRecordFieldUpdates extends AdvancedRule implements core.IRuleDefinition {
  protected qualifiedRecordTriggerTypes: Set<string> = new Set<string>([
    "Create",
    "Update",
    "CreateAndUpdate",
  ]);

  constructor() {
    super(
      {
        name: "SameRecordFieldUpdates",
        label: "Same Record Field Updates",
        description:
          "Before-save same-record field updates allows you to update the record using variable assignments to `$Record`. This is significantly faster than doing another DML on the same-record that triggered the flow",
        supportedTypes: [...core.FlowType.backEndTypes],
        docRefs: [
          {
            label: "Learn about same record field updates",
            path: "https://architect.salesforce.com/decision-guides/trigger-automation#Same_Record_Field_Updates",
          },
        ],
        isConfigurable: false,
        autoFixable: false,
      },
      { severity: "warning" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];

    const isBeforeSaveType = flow.start?.triggerType === "RecordBeforeSave";
    const isQualifiedTriggerTypes = this.qualifiedRecordTriggerTypes.has(
      flow.start?.recordTriggerType
    );

    if (!isBeforeSaveType || !isQualifiedTriggerTypes) {
      return new core.RuleResult(this, results);
    }

    const potentialElements = flow.elements?.filter(
      (node) => node.subtype === "recordUpdates"
    ) as core.FlowNode[];

    if (potentialElements == null || typeof potentialElements[Symbol.iterator] !== "function") {
      return new core.RuleResult(this, results);
    }

    for (const node of potentialElements) {
      if (
        typeof node.element === "object" &&
        "inputReference" in node.element &&
        node.element.inputReference === "$Record"
      ) {
        results.push(new core.ResultDetails(node));
      }
    }

    return new core.RuleResult(this, results);
  }
}
