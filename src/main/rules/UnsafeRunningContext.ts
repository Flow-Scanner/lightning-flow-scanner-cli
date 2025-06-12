import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class UnsafeRunningContext extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super(
      {
        name: "UnsafeRunningContext",
        label: "Unsafe Running Context",
        description: `This flow is configured to run in System Mode without Sharing. This system context grants all running users the permission to view and edit all data in your org. Running a flow in System Mode without Sharing can lead to unsafe data access.`,
        supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
        docRefs: [
          {
            label:
              "Learn about data safety when running flows in system context in Salesforce Help",
            path: "https://help.salesforce.com/s/articleView?id=sf.flow_distribute_context_data_safety_system_context.htm&type=5",
          },
        ],
        isConfigurable: false,
        autoFixable: false,
      },
      { severity: "warning" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const hasRunInMode = "runInMode" in flow.xmldata;
    const runInMode: string = hasRunInMode ? flow.xmldata.runInMode : undefined;
    const riskyMode: string = "SystemModeWithoutSharing";

    const results: core.ResultDetails[] = [];

    if (hasRunInMode && runInMode === riskyMode) {
      results.push(
        new core.ResultDetails(new core.FlowAttribute(runInMode, "runInMode", `== ${riskyMode}`))
      );
    }
    return new core.RuleResult(this, results);
  }
}
