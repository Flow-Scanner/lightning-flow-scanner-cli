import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class ProcessBuilder extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "process-builder-usage",
      name: "ProcessBuilder",
      label: "Process Builder",
      description: "Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Begin migrating your organization’s automation to Flow.",
      supportedTypes: core.FlowType.processBuilder,
      docRefs: [
        {
          label: "Process Builder Retirement",
          path: "https://help.salesforce.com/s/articleView?id=000389396&type=1",
        },
      ],
    });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    return [
      new core.Violation(
        new core.FlowAttribute("Workflow", "processType", "== Workflow")
      ),
    ];
  }
}
