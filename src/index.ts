import {IRuleDefinition} from './main/interfaces/IRuleDefinition';
import { IRulesConfig } from './main/interfaces/IRulesConfig';
import {ApplyOverrides} from './main/libs/ApplyOverrides';
import {FixFlows} from './main/libs/FixFlows';
import {GetRuleDefinitions} from './main/libs/GetRuleDefinitions';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';

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
    ruleOptions.rules.forEach((rule) => {
      const ruleName = Object.keys(rule)[0];
      const ruleSeverity = rule[ruleName].severity;
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
    // Process exceptions
    ruleOptions.exceptions.forEach((exception) => {
      const exceptionNames = Object.keys(exception);
      exceptionNames.forEach((exceptionName) => {
        const innerObjects = exception[exceptionName];
        innerObjects.forEach((innerObject) => {
          const propertyNames = Object.keys(innerObject);
          propertyNames.forEach((propertyName) => {
            const unusedVariables = innerObject[propertyName];
            console.log(`Exception Name: ${exceptionName}`);
            console.log(`Property Name: ${propertyName}`);
            console.log(`Unused Variables: ${unusedVariables}`);
            // todo Additional processing of exceptions if needed
          });
        });
      });
    });
  }

  return scanResults;
}


export function fix(flows: Flow[]): ScanResult[] {
  return FixFlows(flows);
}
