import * as rules from '../config/rules.json';
import {FlowElement} from './FlowElement';
import {FlowVariable} from './FlowVariable';

export class RuleResult {

  constructor(ruleName: string, type: string, results?: (FlowElement[] | FlowVariable[] | [boolean])) {
    this.results = results;
    this.ruleName = ruleName;
    this.type = type;
    this.resultCount = results.length;

    const ruleData = rules.rules.find(rule => rule.name === ruleName);
    this.ruleDescription = ruleData.text;
    this.ruleLabel = ruleData.label;
  }

  public results?: (FlowElement[] | FlowVariable[] | [boolean]);
  public ruleDescription: string;
  public ruleLabel: string;
  public ruleName: string;
  public type: string;
  public resultCount: number;

}
