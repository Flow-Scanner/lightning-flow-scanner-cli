import * as rules from '../config/rules.json';
import {FlowElement} from './FlowElement';
import {FlowVariable} from './FlowVariable';

export class ScanResult {

  constructor(ruleName:string, results: (FlowElement[] | FlowVariable[] | Boolean)) {
    this.ruleName = ruleName;
    this.results = results;

    if (Array.isArray(results)){
      this.resultCount = results.length;
    } else {
      this.resultCount = 1;
    }

    const ruleData = rules.rules.find(rule => rule.name === ruleName);
    this.ruleLabel = ruleData.label;
    this.ruleDescription = ruleData.text;
  }

  public ruleName: String;
  public ruleLabel: String;
  public ruleDescription: String;
  public results?: (FlowElement[] | FlowVariable[] | Boolean);
  public resultCount: Number;

}
