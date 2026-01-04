import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class UnsafeRunningContext extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "unsafe-running-context",
      category: "problem",
      name: "UnsafeRunningContext",
      label: "Unsafe Running Context",
      description: "Flows configured to run in System Mode without Sharing grant access to all data, bypassing user permissions. Avoid this setting to prevent security risks and protect sensitive data.",
      summary: "System mode without sharing creates security risks",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [
        {
          label:
            "Learn about data safety when running flows in system context in Salesforce Help",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_distribute_context_data_safety_system_context.htm&type=5",
        },
      ],
    }, { severity: "error" });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    if (!("runInMode" in flow.xmldata)) {
      return [];
    }

    const runInMode: string = flow.xmldata.runInMode;
    const riskyMode: string = "SystemModeWithoutSharing";

    if (runInMode === riskyMode) {
      return [
        new core.Violation(
          new core.FlowAttribute(runInMode, "runInMode", `== ${riskyMode}`)
        )
      ];
    }

    return [];
  }
}
