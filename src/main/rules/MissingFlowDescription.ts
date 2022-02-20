import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {RuleCommon} from './RuleCommon';

export class MissingFlowDescription extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.MissingFlowDescription, FlowType.allTypes);
  }

  public execute(flow: Flow) : RuleResult {
    const missingFlowDescription = !flow.xmldata.description;
    return new RuleResult(missingFlowDescription, this.name, 'flow');
  }
}
