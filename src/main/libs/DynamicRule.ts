import { rulestore } from '../store/RuleStore';

export class DynamicRule {
  constructor(className: string) {

    if (rulestore[className] === undefined || rulestore[className] === null) {
      throw new Error(`Class type of \'${className}\' is not in the store`);
    }
    return new rulestore[className]();
  }
}
