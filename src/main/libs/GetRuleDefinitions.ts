import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";

export function GetRuleDefinitions(ruleConfig?: Map<string, unknown>): IRuleDefinition[] {
  const selectedRules: IRuleDefinition[] = [];
  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      let severity = "error";
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
    for (const rule in DefaultRuleStore) {
      const matchedRule = new DynamicRule(rule) as IRuleDefinition;
      selectedRules.push(matchedRule);
    }
  }

  return selectedRules;
}

export function getRules(ruleNames?: string[]): IRuleDefinition[] {
  if (ruleNames && ruleNames.length > 0) {
    const ruleSeverityMap = new Map<string, string>(ruleNames.map((name) => [name, "error"]));
    return GetRuleDefinitions(ruleSeverityMap);
  } else {
    return GetRuleDefinitions();
  }
}

export function getBetaRules(): IRuleDefinition[] {
  return getBetaDefinition();
}

function getBetaDefinition(): IRuleDefinition[] {
  return Object.values(BetaRuleStore).map((rule) => new rule() as IRuleDefinition);
}

