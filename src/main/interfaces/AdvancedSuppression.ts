import { RuleResult } from "../models/RuleResult";
import { AdvancedConfig } from "./AdvancedRuleConfig";

/**
 * Interface for implementing advanced suppression logic on rule scan results.
 *
 * @remarks
 * This interface defines a contract for classes or objects that provide suppression capabilities
 * for rule results, potentially modifying or filtering the results based on custom logic and optional configuration.
 *
 * @interface
 */
export interface AdvancedSuppression {
  /**
   * Suppresses or modifies a given rule scan result based on advanced configuration.
   *
   * @param scanResult - The result of a rule scan to be potentially suppressed or altered.
   * @param ruleConfiguration - Optional advanced configuration that may influence suppression logic.
   * @returns The (potentially) suppressed or modified rule result.
   */
  suppress(scanResult: RuleResult, ruleConfiguration?: AdvancedConfig): RuleResult;
}
