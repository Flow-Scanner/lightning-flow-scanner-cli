import { GetRuleDefinitions } from './GetRuleDefinitions';
import * as core from '../../main/internals/internals';

export function ScanFlows(flows: core.Flow[], ruleOptions?: core.IRulesConfig): core.ScanResult[] {

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

    try {
      const ruleResults: core.RuleResult[] = [];
      for (const rule of selectedRules) {
        if (rule.supportedTypes.includes(flow.type[0])) {
          try {
            let config = undefined;

            if (ruleOptions && ruleOptions['rules'] && ruleOptions['rules'][rule.name]) {
              config = ruleOptions['rules'][rule.name];
            }
            const result = (config && Object.keys(config).length > 0) ? rule.execute(flow, config) : rule.execute(flow);
            if (result.severity !== rule.severity) {
              result.severity = rule.severity;
            }
            ruleResults.push(result);
          } catch (error) {
            throw new error("Something went wrong while executing " + rule.name + " in the Flow: '" + flow.name + "'");
          }
        } else {
          ruleResults.push(new core.RuleResult(rule, []));
        }
      }
      flowResults.push(new core.ScanResult(flow, ruleResults));
    }
    catch (error) {
      console.log(error.message)
    }
  }

  return flowResults;
}
