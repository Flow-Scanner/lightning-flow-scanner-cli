import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';
import { RuleDefinitions } from '../store/RuleDefinitions';
const p = require('path');

export class FlowNaming extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.FlowNaming, FlowType.allTypes);
  }

  public execute(flow: Flow, options? :{expression : string}) : RuleResult {
    const regexExp  = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    let flowName = p.basename(p.basename(flow.path), p.extname(flow.path));
    if(flowName.includes('.')){
      flowName = flowName.split('.')[0]
    }
    const conventionApplied = new RegExp(regexExp).test(flowName);
    return new RuleResult( !conventionApplied, this.name, 'flow', this.severity);
  }
}
