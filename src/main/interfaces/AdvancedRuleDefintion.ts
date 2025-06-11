import type { AdvancedRuleConfig } from "./AdvancedRuleConfig";

import { Flow, RuleResult } from "../internals/internals";

export interface AdvancedRuleDefinition {
  execute(
    flow: Flow,
    ruleConfiguration?: AdvancedRuleConfig,
    userFlowSuppressions?: string[]
  ): RuleResult;
}
