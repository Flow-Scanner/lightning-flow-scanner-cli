import { IRuleDefinition } from './main/interfaces/IRuleDefinition';
import { IRulesConfig } from './main/interfaces/IRulesConfig';
import { FixFlows } from './main/libs/FixFlows';
import { GetRuleDefinitions } from './main/libs/GetRuleDefinitions';
import { ScanFlows } from './main/libs/ScanFlows';
import { Flow } from './main/models/Flow';
import { FlowElement } from './main/models/FlowElement';
import { FlowVariable } from './main/models/FlowVariable';
import { ScanResult } from './main/models/ScanResult';

export function getRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames && ruleNames.length > 0) {
    const ruleSeverityMap = new Map<string, string>(ruleNames.map((name) => [name, 'error']));
    return GetRuleDefinitions(ruleSeverityMap);
  } else {
    return GetRuleDefinitions();
  }
}

export function scan(flows: Flow[], ruleOptions?: IRulesConfig): ScanResult[] {
  const ruleMap = new Map<string, {}>();
  let scanResults: ScanResult[];
  if (ruleOptions?.rules && Object.entries(ruleOptions.rules).length > 0) {
    for (const [ruleName, rule] of Object.entries(ruleOptions.rules)) {
      ruleMap.set(ruleName, rule);
    }
    scanResults = ScanFlows(flows, ruleMap);
  } else {
    scanResults = ScanFlows(flows);
  }

  if (ruleOptions?.exceptions) {
    for (const [exceptionName, exceptionElements] of Object.entries(ruleOptions.exceptions)) {
      for (const scanResult of scanResults) {

        if (scanResult.flow.name === exceptionName) {
          for (const ruleResult of scanResult.ruleResults) {
            if (exceptionElements[ruleResult.ruleName]) {
              const exceptions = exceptionElements[ruleResult.ruleName];
              if (ruleResult.details && typeof ruleResult.details === 'string') {
                  if(exceptions.includes(ruleResult.details)){
                    delete ruleResult.details;
                    ruleResult.occurs = false;
                  }
              } else {
                const filteredDetails = (ruleResult.details as (FlowVariable[] | FlowElement[])).filter((detail) => {
                  return !exceptions.includes(detail.name);
                });
                ruleResult.details = filteredDetails;
                ruleResult.occurs = filteredDetails.length > 0;
              }
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