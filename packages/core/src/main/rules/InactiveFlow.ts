import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class InactiveFlow extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "inactive-flow",
      category: "suggestion",
      name: "InactiveFlow",
      label: "Inactive Flow",
      description: "Inactive Flows should be deleted or archived to reduce risk. Even when inactive, they can cause unintended record changes during testing or be activated as subflows. Keeping only active, relevant Flows improves safety and maintainability.",
      summary: "Inactive Flows should be deleted or archived",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
    });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    if (flow.status !== "Active") {
      return [
        new core.Violation(
          new core.FlowAttribute(flow.status, "status", "!= Active")
        ),
      ];
    }
    return [];
  }
}
