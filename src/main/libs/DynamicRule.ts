import { DefaultRuleStore } from '../store/DefaultRuleStore';

export class DynamicRule {
  constructor(className: string) {

    if (DefaultRuleStore[className] === undefined || DefaultRuleStore[className] === null) {
      
      throw new Error(`Rule \'${className}\' does not exist in the store.`);
    }
    return new DefaultRuleStore[className]();
  }
}
