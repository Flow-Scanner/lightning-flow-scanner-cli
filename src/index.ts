import {FixFlows} from './main/libs/FixFlows';
import { GetRuleDefinitions } from './main/libs/GetRuleDefinitions';
import {IRuleDefinition} from './main/libs/IRuleDefinition';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';

export function getRuleDefinitions(ruleNames? : string[]): IRuleDefinition[] {
  if(ruleNames){
    return GetRuleDefinitions(ruleNames);
  } else {
    return GetRuleDefinitions();
  }
}

export function Scan(flows :Flow[], ruleNames? : string[]): ScanResult[] {
  if(ruleNames){
    return ScanFlows(flows, ruleNames);
  } else {
    return ScanFlows(flows);
  }
}

export function Fix(flows :Flow[]): Flow[] {
  return FixFlows(flows);
}
