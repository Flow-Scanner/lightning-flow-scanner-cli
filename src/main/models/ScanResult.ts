import * as rules from '../config/rules.json';
import {FlowElement} from './FlowElement';
import {FlowVariable} from './FlowVariable';

export class ScanResult {

  constructor(ruleName:string, results: (FlowElement[] | FlowVariable[] | Boolean)) {
    this.ruleName = ruleName;
    this.results = results;
    this.resultCount = 0;

    if (Array.isArray(results)){
      this.resultCount = results.length;
      this.type = 'Element';
    } else {
      this.resultCount = 1;
      this.type = 'Flow';
    }

    const ruleData = rules.rules.find(rule => rule.name === ruleName);
    this.ruleLabel = ruleData.label;
    this.ruleDescription = ruleData.text;
  }

  public ruleName: String;
  public ruleLabel: String;
  public type: String;
  public ruleDescription: String;
  public results?: (FlowElement[] | FlowVariable[] | Boolean);
  public resultCount: Number;

}
