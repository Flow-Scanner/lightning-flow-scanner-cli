import { DefaultRuleStore } from '../store/DefaultRuleStore';

export class DynamicRule {
  constructor(className: string) {

    if (DefaultRuleStore[className] === undefined || DefaultRuleStore[className] === null) {
      
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new DefaultRuleStore[className]();
  }
}
