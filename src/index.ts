import {FixFlows} from './main/libs/FixFlows';
import {GetRuleDefinitions} from './main/libs/GetRuleDefinitions';
import {IRuleDefinition} from './main/interfaces/IRuleDefinition';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';
import {RuleOptions} from "./main/models/RuleOptions";
import {FilterUsingIgnoreOptions} from "./main/libs/FilterUsingIgnoreOptions";

export function getRuleDefinitions(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames) {
    return GetRuleDefinitions(ruleNames);
  } else {
    return GetRuleDefinitions();
  }
}

export function scan(flows: Flow[], ruleNames?: string[], ruleOptions?: RuleOptions): ScanResult[] {

  let scanResults: ScanResult[];
  if (ruleNames) {
    scanResults = ScanFlows(flows, ruleNames);
  } else {
    scanResults = ScanFlows(flows);
  }
  if(ruleOptions){
    scanResults = FilterUsingIgnoreOptions(scanResults, ruleOptions);
  }

  return scanResults;
}

export function fix(flows: Flow[]): ScanResult[] {
  return FixFlows(flows);
}
