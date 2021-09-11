import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';
import {ScanResult} from '../models/ScanResult';
import {GetRuleDefinitions} from './GetRuleDefinitions';
import {IRuleDefinition} from '../interfaces/IRuleDefinition';

export function ScanFlows(flows: Flow[], ruleNames? : string[]) : ScanResult[] {
  const flowResults : ScanResult[] = [];

  let selectedRules : IRuleDefinition[];
  if(ruleNames){
    selectedRules = GetRuleDefinitions(ruleNames);
  } else {
    selectedRules = GetRuleDefinitions();
  }

  for (const flow of flows) {
    const scanResults: RuleResult[] = [];
    for (const rule of selectedRules){
      scanResults.push(rule.execute(flow));
    }
    flowResults.push(new ScanResult(flow, scanResults));
  }
  return flowResults;
}
