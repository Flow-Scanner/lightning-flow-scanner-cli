import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { AdvancedRule } from "../models/AdvancedRule";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";

export class DynamicRule<T extends AdvancedRule | IRuleDefinition> {
  constructor(className: string) {
    if (!DefaultRuleStore.hasOwnProperty(className) && BetaRuleStore.hasOwnProperty(className)) {
      return new BetaRuleStore[className]() as T;
    }
    return new DefaultRuleStore[className]() as T;
  }
}