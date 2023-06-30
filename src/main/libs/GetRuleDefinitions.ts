import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {RuleDefinitions} from '../models/RuleDefinitions';
import {DynamicRule} from './DynamicRule';

export function GetRuleDefinitions(ruleConfig?: Map<string, string>): IRuleDefinition[] {
  const matchedRules: any[] = [];
  let severity = 'error';

  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      const matchedRule = new DynamicRule(ruleName);
      const configuredSeverity = ruleConfig.get(ruleName);
      if (configuredSeverity && (configuredSeverity === "error" || configuredSeverity === "warning" || configuredSeverity === "note")) {
        severity = configuredSeverity;
      } else {
        throw new Error(`Invalid severity "${configuredSeverity}" provided for rule "${ruleName}".`);
      }
      matchedRule['severity'] = severity;
      matchedRules.push(matchedRule);
    }
  } else {
    // tslint:disable-next-line:forin
    for (const rule in RuleDefinitions) {
      const matchedRule = new DynamicRule(rule);
      matchedRule['severity'] = severity;
      matchedRules.push(matchedRule);
    }
  }

  return matchedRules;
}
