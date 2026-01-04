import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class MissingRecordTriggerFilter extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "missing-record-trigger-filter",
      name: "MissingRecordTriggerFilter",
      label: "Missing Filter Record Trigger",
      description: "Record-triggered Flows without filters on changed fields or entry conditions execute on every record change. Adding filters ensures the Flow runs only when needed, improving performance.",
      summary: "Filters ensure Flows run only when needed",
      supportedTypes: [core.FlowType.autolaunchedType],
      docRefs: [],
    }, { severity: "warning" });
  }

  protected check(
  flow: core.Flow,
  _options: object | undefined,
  _suppressions: Set<string>
): core.Violation[] {
  const violations: core.Violation[] = [];
  // Check if this is a record-triggered flow
  const triggerType = this.getStartProperty(flow, 'triggerType');
  // Only check flows with record trigger types
  if (!triggerType || !["RecordAfterSave", "RecordBeforeSave"].includes(triggerType)) {
    return violations;
  }
  // Check if the flow has filters or entry conditions at the flow level
  const filters = this.getStartProperty(flow, 'filters');

  const hasFilters = !!filters;
  const scheduledPaths = flow.xmldata?.start?.scheduledPaths;
  const hasScheduledPaths = !!scheduledPaths;
  // If no filters or scheduled paths (which have their own conditions), flag as violation
  if (!hasFilters && !hasScheduledPaths) {
    violations.push(
      new core.Violation(
        new core.FlowAttribute(
          triggerType,
          "triggerType",
          "autolaunched && triggerType"
        )
      )
    );
  }
  return violations;
}
}