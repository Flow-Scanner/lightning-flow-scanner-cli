import {FixFlows} from './main/libs/FixFlows';
import {GetRuleDefinitions} from './main/libs/GetRuleDefinitions';
import {IRuleDefinition} from './main/interfaces/IRuleDefinition';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';
import {ScannerOptions} from "./main/models/ScannerOptions";
import {ApplyOverrides} from "./main/libs/ApplyOverrides";

export function GetRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames) {
    return GetRuleDefinitions(ruleNames);
  } else {
    return GetRuleDefinitions();
  }
}

export function Scan(flows: Flow[], ruleOptions?: ScannerOptions): ScanResult[] {

  let scanResults: ScanResult[];
  if(ruleOptions && ruleOptions.activeRules){
    scanResults = ScanFlows(flows, ruleOptions.activeRules);
  } else {
    scanResults = ScanFlows(flows);
  }
  if(ruleOptions && ruleOptions.overrides){
    scanResults = ApplyOverrides(scanResults, ruleOptions.overrides);
  }

  return scanResults;
}

export function Fix(flows: Flow[]): ScanResult[] {
  return FixFlows(flows);
}
