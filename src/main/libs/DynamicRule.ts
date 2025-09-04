import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { DefaultRuleStore } from "../store/DefaultRuleStore";

export class DynamicRule<T extends IRuleDefinition> {
  constructor(className: string) {
    if (!DefaultRuleStore.hasOwnProperty(className)) {
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new DefaultRuleStore[className]() as T;
  }
}

