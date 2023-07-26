import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';
import { RuleDefinitions } from '../store/RuleDefinitions';

export class FlowNaming extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.FlowNaming, FlowType.allTypes);
  }

  public execute(flow: Flow, ruleOptions? :{regexExp : string}) : RuleResult {

    const regexExp  = ruleOptions.regexExp ? ruleOptions.regexExp : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    const flowName = flow.xmldata.interviewLabel;
    // remove last part {datetime}
    
    const regex = new RegExp(regexExp);
    const conventionApplied = regex.test(flowName);
    return new RuleResult( !conventionApplied, this.name, 'flow', this.severity, flowName);
  }
}
