import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { IRulesConfig } from "../interfaces/IRulesConfig";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";

export function GetRuleDefinitions(ruleConfig?: Map<string, unknown>, options?: IRulesConfig): IRuleDefinition[] {
  const selectedRules: IRuleDefinition[] = [];
  const includeBeta = options?.betamode === true;

  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      let severity = "warning";
      try {
        const configuredSeverity = ruleConfig.get(ruleName)?.["severity"];
        if (
          configuredSeverity &&
          (configuredSeverity === "error" ||
           configuredSeverity === "warning" ||
           configuredSeverity === "note")
        ) {
          severity = configuredSeverity;
        }
        const matchedRule = new DynamicRule(ruleName) as IRuleDefinition;
        if (configuredSeverity) {
          matchedRule.severity = severity;
        }
        selectedRules.push(matchedRule);
      } catch (error) {
        console.log(error.message);
      }
    }
  } else {
    // Load all defaults
    for (const rule in DefaultRuleStore) {
      const matchedRule = new DynamicRule(rule) as IRuleDefinition;
      selectedRules.push(matchedRule);
    }
  }

  // Append all beta rules if opted in (skip if already included via config/default)
  if (includeBeta) {
    for (const betaRuleName in BetaRuleStore) {
      if (!selectedRules.some((r) => r.name === betaRuleName)) {  // Avoid duplicates
        const betaRule = new DynamicRule(betaRuleName) as IRuleDefinition;
        selectedRules.push(betaRule);
      }
    }
  }

  return selectedRules;
}

export function getRules(ruleNames?: string[], options?: IRulesConfig): IRuleDefinition[] {
  if (ruleNames && ruleNames.length > 0) {
    const ruleSeverityMap = new Map<string, { severity: string }>(ruleNames.map((name) => [name, { severity: "error" }]));
    return GetRuleDefinitions(ruleSeverityMap, options);
  } else {
    return GetRuleDefinitions(undefined, options);
  }
}

export function getBetaRules(): IRuleDefinition[] {
  return getBetaDefinition();
}

function getBetaDefinition(): IRuleDefinition[] {
  return Object.values(BetaRuleStore).map((rule) => new rule() as IRuleDefinition);
}