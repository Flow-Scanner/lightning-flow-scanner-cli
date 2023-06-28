import { IRule } from "./IRule";

export interface IRuleCollection {
  [ruleId: string]: IRule;
}