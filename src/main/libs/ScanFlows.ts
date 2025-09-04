import type { IRuleDefinition } from "../interfaces/IRuleDefinition";

import {
  Flow,
  IRulesConfig,
  ResultDetails,
  RuleResult,
  ScanResult,
} from "../../main/internals/internals";
import { AdvancedRuleConfig } from "../interfaces/AdvancedRuleConfig";
import { AdvancedRule } from "../models/AdvancedRule";
import { ParsedFlow } from "../models/ParsedFlow";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";
import { GetRuleDefinitions } from "./GetRuleDefinitions";

const { IS_NEW_SCAN_ENABLED: isNewScanEnabled, OVERRIDE_CONFIG: overrideConfig } = process.env;

// Will be replaced by scanInternal in the future
export function scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[] {
  if (isNewScanEnabled === "true") {
    return scanInternal(parsedFlows, ruleOptions);
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

// Will be removed once scanInternal is fully enabled
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

export function scanInternal(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[] {
  const flows: Flow[] = parsedFlows.map((parsedFlow) => parsedFlow.flow as Flow);
  const scanResults: ScanResult[] = [];
  for (const flow of flows) {
    scanResults.push(scanFlowWithConfig(flow, ruleOptions));
  }
  return scanResults;
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

function ruleAndConfig(
  ruleOptions?: IRulesConfig
): [Record<string, AdvancedRule>, AdvancedRuleConfig] {
  // for unit tests, use a small set of rules
  const ruleConfiguration = unifiedRuleConfig(ruleOptions);
  let allRules: Record<string, AdvancedRule> = { ...DefaultRuleStore, ...BetaRuleStore };
  if (
    overrideConfig === "true" &&
    ruleOptions?.rules &&
    Object.keys(ruleOptions.rules).length > 0
  ) {
    allRules = Object.entries(allRules).reduce<Record<string, AdvancedRule>>(
      (accumulator, [ruleName, rule]) => {
        if (ruleOptions?.rules?.[ruleName]) {
          accumulator[ruleName] = rule;
        }
        return accumulator;
      },
      {}
    );
  }

  return [allRules, ruleConfiguration];
}

function scanFlowWithConfig(flow: Flow, ruleOptions?: IRulesConfig): ScanResult {
  const [allRules, ruleConfiguration] = ruleAndConfig(ruleOptions);
  const ruleResults: RuleResult[] = [];
  for (const [ruleName] of Object.entries(allRules)) {
    const rule = new DynamicRule<AdvancedRule>(ruleName) as AdvancedRule;
    if (
      !rule.supportedTypes.includes(flow.type) ||
      ruleConfiguration?.[ruleName]?.disabled === true
    ) {
      ruleResults.push(new RuleResult(rule as IRuleDefinition, []));
      continue;
    }

    if (ruleConfiguration?.[ruleName]?.severity) {
      rule.severity = ruleConfiguration[ruleName].severity as string;
    }
    const flowName = flow.name as string;
    const userRuleConfiguration = ruleConfiguration[ruleName] ?? {};
    const userFlowSuppressions: string[] = ruleOptions?.exceptions?.[flowName]?.[ruleName] ?? [];

    ruleResults.push(rule.execute2(flow, userRuleConfiguration, userFlowSuppressions));
  }
  return new ScanResult(flow, ruleResults);
}

function unifiedRuleConfig(ruleOptions: IRulesConfig | undefined): AdvancedRuleConfig {
  const configuredRules: AdvancedRuleConfig = ruleOptions?.rules ?? {};
  const activeConfiguredRules: AdvancedRuleConfig = Object.entries(
    configuredRules
  ).reduce<AdvancedRuleConfig>((accumulator, [ruleName, config]) => {
    return { ...accumulator, [ruleName]: config };
  }, {});

  return activeConfiguredRules;
}
