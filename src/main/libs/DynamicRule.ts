import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { DefaultRuleStore } from "../store/DefaultRuleStore";
import { RuleLoader } from "./RuleLoader";
import * as p from "path";

function internalOptedInRule(ruleName: string): IRuleDefinition | never {
  const optedInRule = RuleLoader.loadCustomRule(
    ruleName,
    p.join(__dirname, `../rules/${ruleName}`)
  );

  if (optedInRule) {
    return optedInRule;
  }

  throw new Error(`Rule '${ruleName}' does not exist in the store.`);
}
export class DynamicRule {
  constructor(className: string) {
    if (DefaultRuleStore[className] === undefined || DefaultRuleStore[className] === null) {
      return internalOptedInRule(className) as IRuleDefinition;
    }
    return new DefaultRuleStore[className]() as IRuleDefinition;
  }
}
