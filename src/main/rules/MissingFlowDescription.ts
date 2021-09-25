import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {RuleCommon} from "./RuleCommon";

export class MissingFlowDescription extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.MissingFlowDescription);
  }

  public execute(flow: Flow) : RuleResult {
    let missingFlowDescription = !flow.xmldata.description;
    return new RuleResult(RuleDefinitions.MissingFlowDescription, 'flow', missingFlowDescription);
  }
}
