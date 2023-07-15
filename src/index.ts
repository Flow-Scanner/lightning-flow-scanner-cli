import { IRuleDefinition } from './main/interfaces/IRuleDefinition';
import { IRulesConfig } from './main/interfaces/IRulesConfig';
import { FixFlows } from './main/libs/FixFlows';
import { GetRuleDefinitions } from './main/libs/GetRuleDefinitions';
import { ScanFlows } from './main/libs/ScanFlows';
import { Flow } from './main/models/Flow';
import { ScanResult } from './main/models/ScanResult';

export function getRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames) {
    const ruleSeverityMap = new Map<string, string>(ruleNames.map((name) => [name, 'error']));
    return GetRuleDefinitions(ruleSeverityMap);
  } else {
    return GetRuleDefinitions();
  }
}

export function scan(flows: Flow[], ruleOptions?: IRulesConfig): ScanResult[] {
  const ruleNameSeverityMap = new Map<string, string>();
  let scanResults : ScanResult[];
  if (ruleOptions?.rules && Object.entries(ruleOptions.rules).length > 0) {
    for (const [ruleName, rule] of Object.entries(ruleOptions.rules)) {
      const ruleSeverity = rule.severity;
      ruleNameSeverityMap.set(ruleName, ruleSeverity);
    }
    scanResults = ScanFlows(flows, ruleNameSeverityMap);
  } else {
    scanResults = ScanFlows(flows);
  }

  if (ruleOptions?.exceptions) {
    for (const [exceptionName, exceptionElements] of Object.entries(ruleOptions.exceptions)) {
      for (const scanResult of scanResults) {
        if (scanResult.flow.label[0] === exceptionName) {
          for (const ruleResult of scanResult.ruleResults) {
            if (exceptionElements[ruleResult.ruleName]) {
              const detailNames = exceptionElements[ruleResult.ruleName];
              const filteredDetails = ruleResult.details.filter((detail) => {
                return !detailNames.includes(detail.name);
              });
              ruleResult.details = filteredDetails;
              ruleResult.occurs = filteredDetails.length > 0;
            }
          }
        }
      }
    }
  }

  return scanResults;
}

export function fix(flows: Flow[]): ScanResult[] {
  return FixFlows(flows);
}