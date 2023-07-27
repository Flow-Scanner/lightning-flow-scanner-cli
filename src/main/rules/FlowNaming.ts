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

  public execute(flow: Flow, options? :{expression : string}) : RuleResult {
    const regexExp  = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    const conventionApplied = new RegExp(regexExp).test(flow.name);
    return new RuleResult( !conventionApplied, this.name, 'flow', this.severity, (!conventionApplied) ? flow.name : undefined);
  }
}
