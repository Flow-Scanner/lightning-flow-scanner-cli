import { AdvancedRuleConfig } from "./AdvancedRuleConfig";
import { IExceptions } from "./IExceptions";
import { IRuleOptions } from "./IRuleOptions";

export interface IRulesConfig {
  exceptions?: IExceptions;
  rules?: AdvancedRuleConfig | IRuleOptions;
}
