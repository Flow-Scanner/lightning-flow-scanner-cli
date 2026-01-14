import { RegexRule } from "../models/RegexRule";
import { RegexRuleConfig, RegexScanConfig } from "../models/RegexViolation";

type RuleConstructor = new () => RegexRule;

interface RuleRegistryEntry {
  ruleId: string;
  ruleClass: RuleConstructor;
  legacyName: string;
}

class RuleRegistry {
  private rules: Map<string, RuleRegistryEntry> = new Map();
  private legacyNameMap: Map<string, string> = new Map();

  register(
    ruleId: string,
    ruleClass: RuleConstructor,
    legacyName: string
  ): void {
    const entry: RuleRegistryEntry = {
      ruleId,
      ruleClass,
      legacyName,
    };
    this.rules.set(ruleId, entry);
    this.legacyNameMap.set(legacyName, ruleId);
  }

  get(idOrLegacyName: string): RuleRegistryEntry | undefined {
    let entry = this.rules.get(idOrLegacyName);
    if (!entry) {
      const ruleId = this.legacyNameMap.get(idOrLegacyName);
      if (ruleId) {
        entry = this.rules.get(ruleId);
      }
    }
    return entry;
  }

  getAllRuleIds(): string[] {
    return Array.from(this.rules.keys());
  }

  has(idOrLegacyName: string): boolean {
    return this.get(idOrLegacyName) !== undefined;
  }

  createInstance(idOrLegacyName: string): RegexRule {
    const entry = this.get(idOrLegacyName);
    if (!entry) {
      throw new Error(`Regex rule not found: ${idOrLegacyName}`);
    }
    return new entry.ruleClass();
  }

  /**
   * Get all rules, optionally filtered by config.
   * Supports both ruleId and legacy name lookups.
   */
  getRules(config?: RegexScanConfig): RegexRule[] {
    const selectedRules: RegexRule[] = [];

    for (const ruleId of this.getAllRuleIds()) {
      const rule = this.createInstance(ruleId);

      // Look up config by ruleId or legacy name
      const ruleConfig = (
        config?.rules?.[rule.ruleId] ??
        config?.rules?.[rule.name]
      ) as RegexRuleConfig | undefined;

      // Skip if explicitly disabled
      if (ruleConfig?.enabled === false) continue;

      // Apply severity override
      if (ruleConfig?.severity) {
        rule.severity = ruleConfig.severity;
      }

      selectedRules.push(rule);
    }

    return selectedRules;
  }

  /**
   * Get specific rules by ID or legacy name.
   */
  getRulesByIds(ruleIds: string[]): RegexRule[] {
    const rules: RegexRule[] = [];
    for (const id of ruleIds) {
      if (this.has(id)) {
        rules.push(this.createInstance(id));
      }
    }
    return rules;
  }
}

// Create singleton registry instance
const registry = new RuleRegistry();

// Rules will be registered after they are defined
// Import and register in index.ts to avoid circular dependencies

export const regexRuleRegistry = registry;
