import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { RuleResult } from '../models/RuleResult';
import { ScanResult } from '../models/ScanResult';
import { GetRuleDefinitions } from './GetRuleDefinitions';
import { keys } from './Keys';

export function ScanFlows(flows: Flow[], rulesConfig?: Map<string, {}>): ScanResult[] {

  const flowResults: ScanResult[] = [];
  let selectedRules: IRuleDefinition[] = [];
  if (rulesConfig) {
    selectedRules = GetRuleDefinitions(rulesConfig);
  } else {
    selectedRules = GetRuleDefinitions();
  }

  for (const flow of flows) {
    const ruleResults: RuleResult[] = [];
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
          throw new Error("Something went wrong while executing " + rule.name);
        }
      }
    }
    flowResults.push(new ScanResult(flow, ruleResults));
  }

  return flowResults;
}
