import { AdvancedConfig } from "../interfaces/AdvancedRuleConfig";
import { AdvancedRuleDefinition } from "../interfaces/AdvancedRuleDefintion";
import { AdvancedSuppression } from "../interfaces/AdvancedSuppression";
import { IRuleDefinition, ResultDetails } from "../internals/internals";
import { Flow } from "./Flow";
import { RuleCommon } from "./RuleCommon";
import { RuleInfo } from "./RuleInfo";
import { RuleResult } from "./RuleResult";

export abstract class AdvancedRule extends RuleCommon implements AdvancedRuleDefinition {
  constructor(
    info: RuleInfo,
    optional?: {
      severity?: string;
    }
  ) {
    super(info, optional);
  }

  public execute(
    flow: Flow,
    ruleConfiguration?: AdvancedConfig,
    userFlowSuppressions?: string[]
  ): RuleResult {
    if (!hasAdvancedRuleDefinition(this)) {
      return new RuleResult(this as unknown as IRuleDefinition, []);
    }

    let ruleResult = (this as IRuleDefinition).execute(flow, ruleConfiguration);

    if (hasAdvancedSuppression(this)) {
      ruleResult = this.suppress(ruleResult, ruleConfiguration);
    }

    ruleResult = generalSuppressions(ruleResult, userFlowSuppressions);

    return ruleResult;
  }
}

function generalSuppressions(
  ruleResult: RuleResult,
  userFlowRuleSuppressions?: string[]
): RuleResult {
  if (!userFlowRuleSuppressions || userFlowRuleSuppressions.length === 0) {
    return ruleResult;
  }
  const filteredDetails = (ruleResult.details as ResultDetails[]).filter(
    (detail) => !userFlowRuleSuppressions.includes(detail.name)
  );
  ruleResult.details = filteredDetails;
  ruleResult.occurs = filteredDetails.length > 0;
  return ruleResult;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isFunction = (val: unknown): val is Function => typeof val === "function";

function hasAdvancedRuleDefinition(instance: unknown): instance is AdvancedRuleDefinition {
  return isFunction((instance as AdvancedRuleDefinition).execute);
}

function hasAdvancedSuppression(instance: unknown): instance is AdvancedSuppression {
  return isFunction((instance as AdvancedSuppression).suppress);
}
