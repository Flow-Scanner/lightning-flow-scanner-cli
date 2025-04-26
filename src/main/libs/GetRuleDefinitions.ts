import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";
import { RuleLoader } from "./RuleLoader";

// TODO: Refactor to include beta, opt-in rules.
export function GetRuleDefinitions(ruleConfig?: Map<string, unknown>): IRuleDefinition[] {
  const selectedRules: IRuleDefinition[] = [];
  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      let severity = "error";
      try {
        const configuredPath = ruleConfig.get(ruleName)?.["path"];
        const configuredSeverity = ruleConfig.get(ruleName)?.["severity"];
        if (
          configuredSeverity &&
          (configuredSeverity === "error" ||
            configuredSeverity === "warning" ||
            configuredSeverity === "note")
        ) {
          severity = configuredSeverity;
        }
        if (configuredPath) {
          const customRule = RuleLoader.loadCustomRule(ruleName, configuredPath) as IRuleDefinition;
          customRule.severity = severity;
          selectedRules.push(customRule);
        } else {
          const matchedRule = new DynamicRule(ruleName) as IRuleDefinition;
          matchedRule.severity = severity;
          selectedRules.push(matchedRule);
        }
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
