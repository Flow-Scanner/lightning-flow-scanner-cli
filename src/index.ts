import {
  Flow,
  ParsedFlow,
  ResultDetails,
  RuleResult,
  ScanResult,
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowResource,
  FlowType,
  FlowVariable,
} from "./main/models";
import { FixFlows, GetRuleDefinitions, ParseFlows, ScanFlows, Compiler } from "./main/libs";
import type { IRuleDefinition, IRulesConfig } from "./main/interfaces";

function getRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames && ruleNames.length > 0) {
    const ruleSeverityMap = new Map<string, string>(ruleNames.map((name) => [name, "error"]));
    return GetRuleDefinitions(ruleSeverityMap);
  } else {
    return GetRuleDefinitions();
  }
}

function parse(selectedUris: string[]): Promise<ParsedFlow[]> {
  return ParseFlows(selectedUris);
}

function scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[] {
  const flows: Flow[] = [];
  for (const flow of parsedFlows) {
    if (!flow.errorMessage && flow.flow) {
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

function fix(results: ScanResult[]): ScanResult[] {
  const newResults = [];
  for (const result of results) {
    if (result.ruleResults && result.ruleResults.length > 0) {
      const fixables: RuleResult[] = result.ruleResults.filter(
        (r) =>
          (r.ruleName === "UnusedVariable" && r.occurs) ||
          (r.ruleName === "UnconnectedElement" && r.occurs)
      );
      if (fixables && fixables.length > 0) {
        const newFlow: Flow = FixFlows(result.flow, fixables);
        result.flow = newFlow;
        newResults.push(result);
      }
    }
  }

  return newResults;
}

export {
  Flow,
  ParsedFlow,
  ResultDetails,
  RuleResult,
  ScanResult,
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowResource,
  FlowType,
  FlowVariable,
  Compiler,
  getRules,
  parse,
  scan,
  fix,
};
export type { IRuleDefinition };
