import { RuleResult } from "../internals/internals";
import { AdvancedRuleConfig } from "./AdvancedRuleConfig";

export interface AdvancedSuppression {
  suppress(scanResult: RuleResult, ruleConfiguration?: AdvancedRuleConfig): RuleResult;
}
