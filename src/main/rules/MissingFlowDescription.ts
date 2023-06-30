import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';
import { RuleDefinitions } from '../definitions/RuleDefinitions';

export class MissingFlowDescription extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.MissingFlowDescription, FlowType.allTypes);
  }

  public execute(flow: Flow) : RuleResult {
    if(flow.type[0] === 'Survey'){
      return new RuleResult( false, this.name, 'flow', this.severity);
    }
    const missingFlowDescription = !flow.xmldata.description;
    return new RuleResult(missingFlowDescription, this.name, 'flow', this.severity);
  }
}
