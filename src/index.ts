import {FixFlows} from './main/libs/FixFlows';
import { GetRules } from './main/libs/GetRules';
import {IRuleDefinition} from './main/libs/IRuleDefinition';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';

export function getRules(ruleNames? : string[]): IRuleDefinition[] {
  if(ruleNames){
    return GetRules(ruleNames);
  } else {
    return GetRules();
  }
}

export function scan(flows :Flow[], ruleNames? : string[]): ScanResult[] {
  if(ruleNames){
    return ScanFlows(flows, ruleNames);
  } else {
    return ScanFlows(flows);
  }
}

export function fix(flows :Flow[]): Flow[] {
  return FixFlows(flows);
}
