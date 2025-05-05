import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";

export class DynamicRule {
  constructor(className: string) {
    if (!DefaultRuleStore.hasOwnProperty(className) && BetaRuleStore.hasOwnProperty(className)) {
      return new BetaRuleStore[className]() as IRuleDefinition;
    }
    return new DefaultRuleStore[className]() as IRuleDefinition;
  }
}
