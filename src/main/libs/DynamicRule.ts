import { DefaultRuleStore } from '../store/DefaultRuleStore';

export class DynamicRule {
  constructor(className: string) {

    if (DefaultRuleStore[className] === undefined || DefaultRuleStore[className] === null) {
      
      // todo check if property x is provided
      
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new DefaultRuleStore[className]();
  }
}
