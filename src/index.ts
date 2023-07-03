import { json } from 'stream/consumers';
import { IRuleDefinition } from './main/interfaces/IRuleDefinition';
import { IRulesConfig } from './main/interfaces/IRulesConfig';
import { ApplyOverrides } from './main/libs/ApplyOverrides';
import { FixFlows } from './main/libs/FixFlows';
import { GetRuleDefinitions } from './main/libs/GetRuleDefinitions';
import { ScanFlows } from './main/libs/ScanFlows';
import { Flow } from './main/models/Flow';
import { ScanResult } from './main/models/ScanResult';

export function getRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames) {
    const map = new Map<string, string>();
    for (const str of ruleNames) {
      map.set(str, 'error');
    }
    return GetRuleDefinitions(map);
  } else {
    return GetRuleDefinitions();
  }
}

export function scan(flows: Flow[], ruleOptions?: IRulesConfig): ScanResult[] {
  let scanResults: ScanResult[];
  const ruleNameSeverityMap: Map<string, string> = new Map();

  if (ruleOptions && ruleOptions.rules) {
    Object.entries(ruleOptions.rules).forEach(([ruleName, rule]) => {
      const ruleSeverity = rule.severity;
      ruleNameSeverityMap.set(ruleName, ruleSeverity);
    });

    if (ruleNameSeverityMap.size > 0) {
      scanResults = ScanFlows(flows, ruleNameSeverityMap);
    } else {
      scanResults = ScanFlows(flows);
    }
  } else {
    scanResults = ScanFlows(flows);
  }

if (ruleOptions && ruleOptions.exceptions) {
  Object.entries(ruleOptions.exceptions).forEach(([exceptionName, exceptionElements]) => {
    scanResults.forEach((scanResult) => {
      if (scanResult.flow.label[0] === exceptionName) {
        scanResult.ruleResults.forEach((ruleResult) => {
          if (exceptionElements[ruleResult.ruleName]) {
            const detailNames = exceptionElements[ruleResult.ruleName];
            const filteredDetails = ruleResult.details.filter((detail) => {
              return !detailNames.includes(detail.name);
            });
            ruleResult.details = filteredDetails;
            ruleResult.occurs = filteredDetails.length > 0;
          }
        });
      }
    });
  });
}

  

  return scanResults;
}


export function fix(flows: Flow[]): ScanResult[] {
  return FixFlows(flows);
}