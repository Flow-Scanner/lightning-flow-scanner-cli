import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { FlowAttribute } from '../models/FlowAttribute';
import { ResultDetails } from '../models/ResultDetails';

export class FlowDescription extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'FlowDescription',
      label: 'Missing Flow Description',
      description: "Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.",
      type: 'flow',
      supportedTypes: FlowType.allTypes(),
      docRefs: [],
      isConfigurable: false
    });
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, []);
    }
    const missingFlowDescription = !flow.xmldata.description;
    return (missingFlowDescription ? 
      new RuleResult(this, [new ResultDetails(new FlowAttribute('undefined', "description", "!==null"))]) :
      new RuleResult(this, []));
  }
}