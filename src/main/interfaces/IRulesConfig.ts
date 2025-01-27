import type IExceptions from "./IExceptions";
import type IRuleOptions from "./IRuleOptions";

export default interface IRulesConfig {
  rules?: IRuleOptions;
  exceptions?: IExceptions;
}
