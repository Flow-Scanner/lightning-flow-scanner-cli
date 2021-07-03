import {FixFlows} from './main/libs/FixFlows';
import { GetRules } from './main/libs/GetRules';
import {IRuleDefinition} from './main/libs/IRuleDefinition';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';

export function getRules(allRules : boolean, ruleNames : string[]): IRuleDefinition[] {
  return GetRules(allRules, ruleNames);
}

export function scan(flows :Flow[], ruleNames : string[]): ScanResult[] {
  return ScanFlows(flows, ruleNames);
}

export function fix(flows :Flow[]): Flow[] {
  return FixFlows(flows);
}
