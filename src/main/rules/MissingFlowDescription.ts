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
    if(flow.type[0] === 'Survey'){
      return new RuleResult( false, this.name, 'flow');
    }
    const missingFlowDescription = !flow.xmldata.description;
    return new RuleResult(missingFlowDescription, this.name, 'flow');
  }
}
