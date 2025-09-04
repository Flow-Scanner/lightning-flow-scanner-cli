import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { AdvancedRule } from "../models/AdvancedRule";
import { DefaultRuleStore } from "../store/DefaultRuleStore";

export class DynamicRule<T extends AdvancedRule | IRuleDefinition> {
  constructor(className: string) {
    if (!DefaultRuleStore.hasOwnProperty(className)) {
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new DefaultRuleStore[className]() as T;
  }
}

