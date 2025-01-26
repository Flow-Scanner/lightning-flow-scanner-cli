import type IRuleConfig from "./IRuleConfig";

export default interface IRuleOptions {
  [ruleName: string]: IRuleConfig;
}
