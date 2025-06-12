import { AdvancedConfig } from "../interfaces/AdvancedRuleConfig";
import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class FlowName extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      autoFixable: false,
      description:
        "The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'.",
      docRefs: [
        {
          label: "Naming your Flows is more critical than ever. By Stephen Church",
          path: "https://www.linkedin.com/posts/stephen-n-church_naming-your-flows-this-is-more-critical-activity-7099733198175158274-1sPx?utm_source=share&utm_medium=member_desktop",
        },
      ],
      isConfigurable: true,
      label: "Flow Naming Convention",
      name: "FlowName",
      supportedTypes: core.FlowType.allTypes(),
    });
  }

  public execute(flow: core.Flow, advancedConfig?: AdvancedConfig): core.RuleResult {
    const rawRegexp =
      advancedConfig && advancedConfig.expression
        ? advancedConfig.expression
        : "[A-Za-z0-9]+_[A-Za-z0-9]+";
    const regexExp = rawRegexp as string;
    const flowName = flow.name as string;
    const conventionApplied = new RegExp(regexExp).test(flowName);
    return !conventionApplied
      ? new core.RuleResult(this, [
          new core.ResultDetails(new core.FlowAttribute(flowName, "name", regexExp)),
        ])
      : new core.RuleResult(this, []);
  }
}
