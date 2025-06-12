import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class ProcessBuilder extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      name: "ProcessBuilder",
      label: "No Process Builder",
      description:
        "Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Ensure you're prepared for this transition by migrating your organization's automation to Flow. Refer to official documentation for more information on the transition process and tools available.",
      supportedTypes: core.FlowType.processBuilder,
      docRefs: [
        {
          label: "Process Builder Retirement",
          path: "https://help.salesforce.com/s/articleView?id=000389396&type=1",
        },
      ],
      isConfigurable: true,
      autoFixable: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(flow: core.Flow, options?: { expression: string }): core.RuleResult {
    return new core.RuleResult(this, [
      new core.ResultDetails(new core.FlowAttribute("Workflow", "processType", "== Workflow")),
    ]);
  }
}
