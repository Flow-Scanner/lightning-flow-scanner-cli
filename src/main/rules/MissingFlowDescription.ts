import * as rules from '../config/rules.json';
import {IRuleDefinition} from '../libs/IRuleDefinition';
import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';

export class MissingFlowDescription implements IRuleDefinition{

  constructor() {
    const rule = rules.rules.find(rule => rule.name === 'DMLStatementInLoop');
    this.name = rule.name;
    this.label = rule.label;
    this.text = rule.text;
  }

  public name: string;
  public label: string;
  public text: string;

    public execute(flow: Flow) : RuleResult {
      return new RuleResult('MissingFlowDescription', 'flow', [!flow.xmldata.Flow.description]);
    }
}
