import { IExceptions } from "./IExceptions";
import { IRuleOptions } from "./IRuleOptions";

export interface IRulesConfig {
  betamode?: boolean;
  exceptions?: IExceptions;
  rules?: IRuleOptions; 
}