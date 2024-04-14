import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class FlowDescription extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'FlowDescription',
      label: 'Missing Flow Description',
      description: "Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [],
      isConfigurable: false, 
      autoFixable: false
    });
  }

  public execute(flow: core.Flow): core.RuleResult {

    const missingFlowDescription = !flow.xmldata.description;
    return (missingFlowDescription ? 
      new core.RuleResult(this, [new core.ResultDetails(new core.FlowAttribute('undefined', "description", "!==null"))]) :
      new core.RuleResult(this, []));
  }
}