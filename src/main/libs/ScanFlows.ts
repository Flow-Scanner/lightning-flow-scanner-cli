import type { IRuleDefinition } from "../interfaces/IRuleDefinition";

import {
  Flow,
  IRulesConfig,
  ResultDetails,
  RuleResult,
  ScanResult,
} from "../../main/internals/internals";
import { ParsedFlow } from "../models/ParsedFlow";
import { GetRuleDefinitions } from "./GetRuleDefinitions";
import { scan2 } from "./Scan";

const { IS_NEW_SCAN_ENABLED: isNewScanEnabled, OVERRIDE_CONFIG: overrideConfig } = process.env;

export function scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[] {
 
  // TD see jest.env-setup.ts for testing scan2
  if (isNewScanEnabled === "true" && overrideConfig !== null && overrideConfig !== undefined) {
    return scan2(parsedFlows, ruleOptions);
  }

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

  generalSuppressions(scanResults, ruleOptions);

  return scanResults;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ScanFlows(flows: Flow[], ruleOptions?: IRulesConfig): ScanResult[] {
  const flowResults: ScanResult[] = [];

  let selectedRules: IRuleDefinition[] = [];
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
    const ruleResults: RuleResult[] = [];
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
          ruleResults.push(new RuleResult(rule, []));
        }
      } catch (error) {
        const message = `Something went wrong while executing ${rule.name} in the Flow: ${flow.name} with error ${error}`;
        ruleResults.push(new RuleResult(rule, [], message));
      }
    }
    flowResults.push(new ScanResult(flow, ruleResults));
  }

  return flowResults;
}

function generalSuppressions(scanResults: ScanResult[], ruleOptions?: IRulesConfig) {
  if (!ruleOptions?.exceptions) {
    return;
  }
  const applyExceptionToResults = (ruleResult: RuleResult, exceptions: string[]) => {
    const filteredDetails = (ruleResult.details as ResultDetails[]).filter(
      (detail) => !exceptions.includes(detail.name)
    );
    ruleResult.details = filteredDetails;
    ruleResult.occurs = filteredDetails.length > 0;
  };

  for (const [flowName, exceptionElements] of Object.entries(ruleOptions.exceptions)) {
    const matchingScanResult = scanResults.find((result) => result.flow.name === flowName);
    if (!matchingScanResult) {
      continue;
    }

    for (const ruleResult of matchingScanResult.ruleResults as RuleResult[]) {
      const exceptions = exceptionElements[ruleResult.ruleName];
      if (!exceptions) {
        continue;
      }

      applyExceptionToResults(ruleResult, exceptions);
    }
  }
}





