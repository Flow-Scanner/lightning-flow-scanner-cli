import { IRuleConfig } from "../interfaces/IRuleConfig";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { IRulesConfig } from "../interfaces/IRulesConfig";
import { ruleRegistry } from "../config/RuleRegistry";

export function GetRuleDefinitions(
  ruleConfig?: Map<string, unknown>,
  options?: IRulesConfig
): IRuleDefinition[] {
  const includeBeta = options?.betaMode === true || options?.betamode === true;
  const rulesMode = options?.ruleMode || "merged";
  const selectedRules: IRuleDefinition[] = [];

  const ruleIds = ruleRegistry.getAllRuleIds(includeBeta);

  // ISOLATED MODE
  if (rulesMode === "isolated" && ruleConfig && ruleConfig.size > 0) {
    for (const key of ruleConfig.keys()) {
      // key can now be either ruleId (new) or legacyName (old config compatibility)
      const entry = ruleRegistry.get(key);
      if (!entry) continue;

      const config = ruleConfig.get(key) as IRuleConfig | undefined;
      if (config?.enabled === false) continue;

      const rule = ruleRegistry.createInstance(entry.ruleId);  // Always use ruleId to instantiate

      if (config?.severity) {
        rule.severity = config.severity;
      }

      selectedRules.push(rule);
    }
    return selectedRules;
  }

  // MERGED MODE (default)
  for (const ruleId of ruleIds) {
    const rule = ruleRegistry.createInstance(ruleId);

    // Try to find config by ruleId first, then fall back to legacy name
    const config = (
      ruleConfig?.get(rule.ruleId) ??
      ruleConfig?.get(rule.name)  // rule.name is the legacy camelCase name (e.g. "ActionCallsInLoop")
    ) as IRuleConfig | undefined;

    if (config?.enabled === false) continue;

    if (config?.severity) {
      rule.severity = config.severity;
    }

    selectedRules.push(rule);
  }

  return selectedRules;
}

export function getRules(
  ruleNames?: string[],
  options?: IRulesConfig
): IRuleDefinition[] {
  return ruleRegistry.getRulesByNames(ruleNames, options);
}