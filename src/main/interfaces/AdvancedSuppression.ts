import { RuleResult } from "../internals/internals";
import { AdvancedConfig } from "./AdvancedRuleConfig";
export interface AdvancedSuppression {
  suppress(scanResult: RuleResult, ruleConfiguration?: AdvancedConfig): RuleResult;
}
