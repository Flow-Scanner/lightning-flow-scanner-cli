import { GetRuleDefinitions } from "./GetRuleDefinitions";
import * as core from "../../main/internals/internals";
import { ParsedFlow } from "../models/ParsedFlow";

export function scan(
  parsedFlows: ParsedFlow[],
  ruleOptions?: core.IRulesConfig
): core.ScanResult[] {
  const flows: core.Flow[] = [];
  for (const flow of parsedFlows) {
    if (!flow.errorMessage && flow.flow) {
      flows.push(flow.flow);
    }
  }
  let scanResults: core.ScanResult[];
  if (ruleOptions?.rules && Object.entries(ruleOptions.rules).length > 0) {
    scanResults = ScanFlows(flows, ruleOptions);
  } else {
    scanResults = ScanFlows(flows);
  }

  if (ruleOptions?.exceptions) {
    for (const [exceptionName, exceptionElements] of Object.entries(ruleOptions.exceptions)) {
      for (const scanResult of scanResults) {
        if (scanResult.flow.name === exceptionName) {
          for (const ruleResult of scanResult.ruleResults as core.RuleResult[]) {
            if (exceptionElements[ruleResult.ruleName]) {
              const exceptions = exceptionElements[ruleResult.ruleName];
              const filteredDetails = (ruleResult.details as core.ResultDetails[]).filter(
                (detail) => {
                  return !exceptions.includes(detail.name);
                }
              );
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

export function ScanFlows(flows: core.Flow[], ruleOptions?: core.IRulesConfig): core.ScanResult[] {
  const flowResults: core.ScanResult[] = [];

  let selectedRules: core.IRuleDefinition[] = [];
  if (ruleOptions && ruleOptions.rules) {
    const ruleMap = new Map<string, object>();
    for (const [ruleName, rule] of Object.entries(ruleOptions.rules)) {
      ruleMap.set(ruleName, rule);
    }
    selectedRules = GetRuleDefinitions(ruleMap);
  } else {
    selectedRules = GetRuleDefinitions();
  }

  for (const flow of flows) {
    const ruleResults: core.RuleResult[] = [];
    for (const rule of selectedRules) {
      try {
        if (rule.supportedTypes.includes(flow.type)) {
          let config: unknown = undefined;
          if (ruleOptions && ruleOptions["rules"] && ruleOptions["rules"][rule.name]) {
            config = ruleOptions["rules"][rule.name];
          }
          const result =
            config && Object.keys(config).length > 0
              ? rule.execute(flow, config)
              : rule.execute(flow);
          if (result.severity !== rule.severity) {
            result.severity = rule.severity as string;
          }
          ruleResults.push(result);
        } else {
          ruleResults.push(new core.RuleResult(rule, []));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        const message =
          "Something went wrong while executing " + rule.name + " in the Flow: '" + flow.name;
        ruleResults.push(new core.RuleResult(rule, [], message));
      }
    }
    flowResults.push(new core.ScanResult(flow, ruleResults));
  }

  return flowResults;
}
