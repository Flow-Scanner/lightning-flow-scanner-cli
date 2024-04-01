import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import { DefaultRuleStore } from '../store/DefaultRuleStore';
import { DynamicRule } from './DynamicRule';
import { RuleLoader } from './RuleLoader';

export function GetRuleDefinitions(ruleConfig?: Map<string, {}>): IRuleDefinition[] {
  const selectedRules: any[] = [];
  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      let severity = 'error';
      try {
        const configuredPath = ruleConfig.get(ruleName)['path']
        const configuredSeverity = ruleConfig.get(ruleName)['severity'];
        if (configuredSeverity && (configuredSeverity === "error" || configuredSeverity === "warning" || configuredSeverity === "note")) {
          severity = configuredSeverity;
        }
        if(configuredPath){

          let customRule = RuleLoader.loadCustomRule(ruleName, configuredPath);
          selectedRules['severity'] = severity;
          selectedRules.push(customRule);
        } else {
          const matchedRule = new DynamicRule(ruleName);
          matchedRule['severity'] = severity;
          selectedRules.push(matchedRule);
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  } else {
    // tslint:disable-next-line:forin
    for (const rule in DefaultRuleStore) {
      const matchedRule = new DynamicRule(rule);
      matchedRule['severity'] = 'error';
      selectedRules.push(matchedRule);
    }
  }

  return selectedRules;
}
