import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {DynamicRule} from './DynamicRule';
import {IRuleDefinition} from '../interfaces/IRuleDefinition';

export function GetRuleDefinitions(ruleNames? : string[]) : IRuleDefinition[] {
  const matchedRules : any = [];

  if(ruleNames && Array.isArray(ruleNames)){
    for(const ruleName of ruleNames){
      const matchedRule = new DynamicRule(ruleName);
      // @ts-ignore
      matchedRules.push(matchedRule);
    }
  } else {
    // tslint:disable-next-line:forin
    for (const rule in RuleDefinitions) {
      const matchedRule = new DynamicRule(rule);
      matchedRules.push(matchedRule);
    }
  }
  return matchedRules;
}
