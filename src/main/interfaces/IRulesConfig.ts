import type IExceptions from "./IExceptions";
import type IRuleOptions from "./IRuleOptions";

export interface IRulesConfig {
  rules?: IRuleOptions;
  exceptions?: IExceptions;
}
