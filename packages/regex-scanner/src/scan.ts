import { MetadataFile } from "./models/MetadataFile";
import { RegexViolation, RegexScanConfig, RegexRuleConfig } from "./models/RegexViolation";
import { regexRuleRegistry } from "./config/RuleRegistry";

/**
 * Scan metadata files using regex-based rules.
 * Returns flat violations directly (no nested structure).
 *
 * @param files - Array of metadata files to scan
 * @param config - Optional configuration for rules
 * @returns Array of flat violations
 */
export function scanRegex(
  files: MetadataFile[],
  config?: RegexScanConfig
): RegexViolation[] {
  const violations: RegexViolation[] = [];

  // Get all enabled rules based on config
  const rules = regexRuleRegistry.getRules(config);

  for (const file of files) {
    for (const rule of rules) {
      // Get rule-specific config
      const ruleConfig = (
        config?.rules?.[rule.ruleId] ??
        config?.rules?.[rule.name]
      ) as RegexRuleConfig | undefined;

      // Execute rule and collect violations
      const ruleViolations = rule.execute(file, ruleConfig);
      violations.push(...ruleViolations);
    }
  }

  return violations;
}

/**
 * Scan a single metadata file.
 * Convenience wrapper around scanRegex for single-file scanning.
 */
export function scanFile(
  file: MetadataFile,
  config?: RegexScanConfig
): RegexViolation[] {
  return scanRegex([file], config);
}

/**
 * Get all available rule IDs.
 */
export function getRegexRuleIds(): string[] {
  return regexRuleRegistry.getAllRuleIds();
}

/**
 * Check if a rule exists by ID or legacy name.
 */
export function hasRegexRule(idOrName: string): boolean {
  return regexRuleRegistry.has(idOrName);
}
