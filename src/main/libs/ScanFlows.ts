import { GetRuleDefinitions } from "./GetRuleDefinitions";
import * as core from "../../main/internals/internals";

export function ScanFlows(
  flows: core.Flow[],
  ruleOptions?: core.IRulesConfig
): core.ScanResult[] {
  const flowResults: core.ScanResult[] = [];

  let selectedRules: core.IRuleDefinition[] = [];
  if (ruleOptions && ruleOptions.rules) {
    const ruleMap = new Map<string, {}>();
    for (const [ruleName, rule] of Object.entries(ruleOptions.rules)) {
      ruleMap.set(ruleName, rule);
    }
    selectedRules = GetRuleDefinitions(ruleMap);
  } else {
    selectedRules = GetRuleDefinitions();
  }

  for (const flow of flows) {
    const ruleResults: core.RuleResult[] = [];
    for (const rule of selectedRules) {
      try {
        if (rule.supportedTypes.includes(flow.type)) {
          let config = undefined;
          if (
            ruleOptions &&
            ruleOptions["rules"] &&
            ruleOptions["rules"][rule.name]
          ) {
            config = ruleOptions["rules"][rule.name];
          }
          const result =
            config && Object.keys(config).length > 0
              ? rule.execute(flow, config)
              : rule.execute(flow);
          if (result.severity !== rule.severity) {
            result.severity = rule.severity;
          }
          ruleResults.push(result);
        } else {
          ruleResults.push(new core.RuleResult(rule, []));
        }
      } catch (error) {
        let message =
          "Something went wrong while executing " +
          rule.name +
          " in the Flow: '" +
          flow.name;
        ruleResults.push(new core.RuleResult(rule, [], message));
      }
    }
    flowResults.push(new core.ScanResult(flow, ruleResults));
  }

  return flowResults;
}
