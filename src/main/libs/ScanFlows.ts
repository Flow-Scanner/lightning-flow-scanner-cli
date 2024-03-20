import { GetRuleDefinitions } from './GetRuleDefinitions';
import { keys } from './Keys';
import * as core from '../../index';

export function ScanFlows(flows: core.Flow[], rulesConfig?: Map<string, {}>): core.ScanResult[] {

  const flowResults: core.ScanResult[] = [];
  let selectedRules: core.IRuleDefinition[] = [];
  if (rulesConfig) {
    selectedRules = GetRuleDefinitions(rulesConfig);
  } else {
    selectedRules = GetRuleDefinitions();
  }

  for (const flow of flows) {

    try{
      const ruleResults: core.RuleResult[] = [];
      for (const rule of selectedRules) {
        if (rule.supportedTypes.includes(flow.type[0])) {
          try {
            let config = undefined;
            if (rulesConfig) {
              const configKeys = keys(rulesConfig);
              let matchedKey = configKeys.find(element => element = rule.name);
              config = rulesConfig.get(matchedKey);
              config['severity'];
            }
            const result = config && Object.keys(config).length > 0 ? rule.execute(flow, config) : rule.execute(flow);
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
