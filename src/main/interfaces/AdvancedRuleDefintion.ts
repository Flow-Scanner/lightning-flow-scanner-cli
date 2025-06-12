import { Flow, RuleResult } from "../internals/internals";
import { AdvancedConfig } from "./AdvancedRuleConfig";

export interface AdvancedRuleDefinition {
  execute2(
    flow: Flow,
    ruleConfiguration?: AdvancedConfig,
    userFlowSuppressions?: string[]
  ): RuleResult;
}
