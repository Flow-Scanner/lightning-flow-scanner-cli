import {IRuleDefinition} from './main/interfaces/IRuleDefinition';
import { IRulesConfig } from './main/interfaces/IRulesConfig';
import { FixFlows } from './main/libs/FixFlows';
import { GetRuleDefinitions } from './main/libs/GetRuleDefinitions';
import { ParseFlows } from './main/libs/ParseFlows';
import { ScanFlows } from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import { ParsedFlow } from './main/models/ParsedFlow';
import {ResultDetails} from './main/models/ResultDetails';
import {RuleResult} from './main/models/RuleResult';
import {ScanResult} from './main/models/ScanResult';

export function getRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames && ruleNames.length > 0) {
    const ruleSeverityMap = new Map<string, string>(ruleNames.map((name) => [name, 'error']));
    return GetRuleDefinitions(ruleSeverityMap);
  } else {
    return GetRuleDefinitions();
  }
}

export function parse(selectedUris: any): Promise<ParsedFlow[]> {
  return ParseFlows(selectedUris);
}



export function scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[] {

  let flows: Flow[] = [];
  for(let flow of parsedFlows){
    if(!flow.errorMessage && flow.flow){
      flows.push(flow.flow);
    }
  }
  let scanResults: ScanResult[];
  if (ruleOptions?.rules && Object.entries(ruleOptions.rules).length > 0) {
    scanResults = ScanFlows(flows, ruleOptions);
  } else {
    scanResults = ScanFlows(flows);
  }

  if (ruleOptions?.exceptions) {
    for (const [exceptionName, exceptionElements] of Object.entries(ruleOptions.exceptions)) {
      for (const scanResult of scanResults) {
        if (scanResult.flow.name === exceptionName) {
          for (const ruleResult of scanResult.ruleResults as RuleResult[]) {
            if (exceptionElements[ruleResult.ruleName]) {
              const exceptions = exceptionElements[ruleResult.ruleName];
              const filteredDetails = (ruleResult.details as ResultDetails[]).filter((detail) => {
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

  return scanResults;
}

export function fix(results : ScanResult[]): ScanResult[] {
  
  let newResults = [];
  for (let result of results){
    if(result.ruleResults && result.ruleResults.length > 0){
      let fixables:RuleResult[] = result.ruleResults.filter((r) => r.ruleName === 'UnusedVariable' && r.occurs || r.ruleName === 'UnconnectedElement' && r.occurs );
      if(fixables && fixables.length > 0){
        const newFlow: Flow = FixFlows(result.flow, fixables);
        result.flow = newFlow;
        newResults.push(result);
      }
    }
   
  }

  return newResults
}

export { Flow } from './main/models/Flow';
export { FlowAttribute } from './main/models/FlowAttribute';
export { FlowElement } from './main/models/FlowElement';
export { FlowNode } from './main/models/FlowNode';
export { FlowResource } from './main/models/FlowResource';
export { FlowType } from './main/models/FlowType';
export { FlowVariable } from './main/models/FlowVariable';
export { Compiler } from './main/libs/Compiler';
export { ScanResult } from './main/models/ScanResult';
export { RuleResult } from './main/models/RuleResult';
export { ResultDetails } from './main/models/ResultDetails';
export { IRuleDefinition } from './main/interfaces/IRuleDefinition';
