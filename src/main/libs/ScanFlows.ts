import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';
import {ScanResult} from '../models/ScanResult';
import {GetRules} from './GetRules';
import {IRuleDefinition} from './IRuleDefinition';

export function ScanFlows(flows: Flow[], ruleNames? : string[]) : ScanResult[] {
  const flowResults : ScanResult[] = [];

  let selectedRules : IRuleDefinition[];
  if(ruleNames){
    selectedRules = GetRules(false, ruleNames);
  } else {
    selectedRules = GetRules(true, []);
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
