import * as rules from '../config/rules.json';
import {DynamicRule} from './DynamicRule';
import {IRuleDefinition} from './IRuleDefinition';

export function GetRules(allRules : boolean, ruleNames? : string[]) : IRuleDefinition[] {
  const matchedRules : any = [];

  if(allRules){
    rules.rules.forEach(rule => {
      const matchedRule = new DynamicRule(rule.name);
      matchedRules.push(matchedRule);
    });
  } else {
    for(const ruleName of ruleNames){
      const matchedRule = new DynamicRule(ruleName);
      // @ts-ignore
      matchedRules.push(matchedRule);
    }
  }
  return matchedRules;
}
