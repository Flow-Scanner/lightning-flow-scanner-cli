import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class ProcessBuilder extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "process-builder-usage",
      name: "ProcessBuilder",
      label: "Process Builder",
      description: "Process Builder is retired. Continuing to use it increases maintenance overhead and risks future compatibility issues. Migrating automation to Flow reduces risk and improves maintainability.",
      supportedTypes: core.FlowType.processBuilder,
      docRefs: [
        {
          label: "Process Builder Retirement",
          path: "https://help.salesforce.com/s/articleView?id=000389396&type=1",
        },
      ],
    }, { severity: "error" });
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
