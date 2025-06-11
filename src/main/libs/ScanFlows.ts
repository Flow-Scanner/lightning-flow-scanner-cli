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
// eslint-disable-next-line sonarjs/cognitive-complexity
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

function ruleAndConfig(
  ruleOptions?: IRulesConfig
): [Record<string, AdvancedRule>, Record<string, AdvancedRuleConfig>] {
  // for unit tests, use a small set of rules
  const ruleConfiguration = unifiedRuleConfig(ruleOptions);
  let allRules: Record<string, AdvancedRule> = { ...DefaultRuleStore, ...BetaRuleStore };
  if (overrideConfig === "true" && ruleOptions?.rules) {
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
    const advancedRule = new DynamicRule<AdvancedRule>(ruleName);
    ruleResults.push(
      (advancedRule as AdvancedRule).execute(flow, ruleConfiguration[ruleName] ?? {})
    );
  }
  return new ScanResult(flow, ruleResults);
}

function unifiedRuleConfig(
  ruleOptions: IRulesConfig | undefined
): Record<string, AdvancedRuleConfig> {
  const configuredRules: AdvancedRuleConfig = ruleOptions?.rules ?? {};
  const activeConfiguredRules: Record<string, AdvancedRuleConfig> = Object.entries(configuredRules)
    .filter(([, configuration]) => {
      if (!("disabled" in configuration)) {
        return true;
      }

      return configuration.disabled !== true;
    })
    .reduce<Record<string, AdvancedRuleConfig>>((accumulator, [ruleName, config]) => {
      return { ...accumulator, [ruleName]: config as AdvancedRuleConfig };
    }, {});

  return activeConfiguredRules;
}
