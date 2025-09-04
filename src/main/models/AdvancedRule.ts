import { inspect } from "util";

import { AdvancedConfig } from "../interfaces/AdvancedRuleConfig";
import { AdvancedRuleDefinition } from "../interfaces/AdvancedRuleDefintion";
import { AdvancedSuppression } from "../interfaces/AdvancedSuppression";
import { IRuleDefinition, ResultDetails } from "../internals/internals";
import { Flow } from "./Flow";
import { RuleCommon } from "./RuleCommon";
import { RuleInfo } from "./RuleInfo";
import { RuleResult } from "./RuleResult";

/**
 * Abstract base class for advanced rules, extending {@link RuleCommon} and implementing
 * {@link AdvancedRuleDefinition} and {@link IRuleDefinition}.
 *
 * @remarks
 * This class provides a structure for advanced rule implementations, including
 * support for advanced suppression and user-defined suppressions.
 *
 * @param info - The rule metadata information.
 * @param optional - Optional configuration, such as severity.
 */
export abstract class AdvancedRule
  extends RuleCommon
  implements AdvancedRuleDefinition, IRuleDefinition
{
  /**
   * Constructs an instance of {@link AdvancedRule}.
   *
   * @param info - The rule metadata information.
   * @param optional - Optional configuration, such as severity.
   */
  constructor(
    info: RuleInfo,
    optional?: {
      severity?: string;
    }
  ) {
    super(info, optional);
  }

  /**
   * Your rule
   * @param flow - The flow to analyze.
   * @param ruleOptions - Optional rule-specific options.
   */
  abstract execute(flow: Flow, ruleOptions?: object): RuleResult;

  /**
   * Executes the rule with advanced configuration and applies suppressions.
   *
   * @param flow - The flow to analyze.
   * @param ruleConfiguration - Optional advanced rule configuration.
   * @param userFlowSuppressions - Optional list of user-defined suppressions.
   * @returns The result of rule execution after applying suppressions.
   */
  public execute2(
    flow: Flow,
    ruleConfiguration?: AdvancedConfig,
    userFlowSuppressions?: string[]
  ): RuleResult {
    if (!hasClassicRuleDefinition(this)) {
      return new RuleResult(this as unknown as IRuleDefinition, []);
    }

    let ruleResult;
    try {
      ruleResult = (this as IRuleDefinition).execute(flow, ruleConfiguration);
    } catch (error) {
      return new RuleResult(this as unknown as IRuleDefinition, [], inspect(error));
    }

    if (hasAdvancedSuppression(this)) {
      ruleResult = this.suppress(ruleResult, ruleConfiguration);
    }

    ruleResult = generalSuppressions(ruleResult, userFlowSuppressions);

    return ruleResult;
  }
}
/**
 * Applies user-defined suppressions to the rule result.
 *
 * @param ruleResult - The result of rule execution.
 * @param userFlowRuleSuppressions - Optional list of suppression names to filter out.
 * @returns The filtered rule result.
 */
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

/**
 * Type guard to check if a value is a function.
 *
 * @param val - The value to check.
 * @returns True if the value is a function, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isFunction = (val: unknown): val is Function => typeof val === "function";

/**
 * Type guard to check if an instance implements {@link AdvancedSuppression}.
 *
 * @param instance - The instance to check.
 * @returns True if the instance has a suppress method, false otherwise.
 */
function hasAdvancedSuppression(instance: unknown): instance is AdvancedSuppression {
  return isFunction((instance as AdvancedSuppression).suppress);
}

/**
 * Type guard to check if an instance implements {@link IRuleDefinition}.
 *
 * @param instance - The instance to check.
 * @returns True if the instance has an execute method, false otherwise.
 */
function hasClassicRuleDefinition(instance: unknown): instance is IRuleDefinition {
  return isFunction((instance as IRuleDefinition).execute);
}
