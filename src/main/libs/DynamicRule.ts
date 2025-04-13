import { DefaultRuleStore } from "../store/DefaultRuleStore";
import { RuleLoader } from "./RuleLoader";
import * as p from "path";
export class DynamicRule {
  constructor(className: string) {
    if (DefaultRuleStore[className] === undefined || DefaultRuleStore[className] === null) {
      const customRule = RuleLoader.loadCustomRule(
        className,
        p.join(new URL(import.meta.url).pathname, `../../rules/${className}`)
      );
      if (customRule) {
        return customRule;
      }
      throw new Error(`Rule '${className}' does not exist in the store.`);
    }
    return new DefaultRuleStore[className]();
  }
}
