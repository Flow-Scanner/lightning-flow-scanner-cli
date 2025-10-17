import {
  Flow,
  IRuleDefinition,
  IRulesConfig,
  RuleResult,
  ScanResult,
} from "../../main/internals/internals";
import { AdvancedRuleConfig } from "../interfaces/AdvancedRuleConfig";
import { AdvancedRule } from "../models/AdvancedRule";
import { ParsedFlow } from "../models/ParsedFlow";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";

// TD: scan2 is not enabled
export function scan2(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[] {
  const flows: Flow[] = parsedFlows.map((parsedFlow) => parsedFlow.flow as Flow);
  const scanResults: ScanResult[] = [];
  for (const flow of flows) {
    scanResults.push(scanFlowWithConfig(flow, ruleOptions));
  }
  return scanResults;
}

function ruleAndConfig(
  ruleOptions?: IRulesConfig
): [Record<string, AdvancedRule>, AdvancedRuleConfig] {
  // for unit tests, use a small set of rules
  const ruleConfiguration = unifiedRuleConfig(ruleOptions);
  let allRules: Record<string, AdvancedRule> = { ...DefaultRuleStore, ...BetaRuleStore };
  if (
    // overrideConfig === "true" &&
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