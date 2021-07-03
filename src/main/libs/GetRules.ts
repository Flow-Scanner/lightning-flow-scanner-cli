import * as rules from '../config/rules.json';
import {DynamicRule} from './DynamicRule';
import {IRuleDefinition} from './IRuleDefinition';

export function GetRules(ruleNames? : string[]) : IRuleDefinition[] {
  const matchedRules : any = [];

  if(ruleNames){
    for(const ruleName of ruleNames){
      const matchedRule = new DynamicRule(ruleName);
      // @ts-ignore
      matchedRules.push(matchedRule);
    }
  } else {
    rules.rules.forEach(rule => {
      const matchedRule = new DynamicRule(rule.name);
      matchedRules.push(matchedRule);
    });
  }
  return matchedRules;
}
