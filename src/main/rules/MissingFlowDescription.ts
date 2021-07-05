import {IRuleDefinition} from '../libs/IRuleDefinition';
import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {RuleInfo} from '../ruledefinitions/RuleInfo';

export class MissingFlowDescription implements IRuleDefinition{

  constructor() {
    const rule = RuleInfo(RuleDefinitions.MissingFlowDescription);
    this.name = RuleDefinitions.MissingFlowDescription;
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
