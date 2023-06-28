import { IRule } from "../interfaces/IRule";
import { IRuleCollection } from "../interfaces/IRuleCollection";

export class RulesConfig {
    rules: IRuleCollection;
  
    constructor() {
      this.rules = {};
    }
  
    addRule(ruleId: string, rule: IRule) {
      this.rules[ruleId] = rule;
    }
  
    removeRule(ruleId: string) {
      delete this.rules[ruleId];
    }
  }
  