import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';

export class FlowDescription extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'FlowDescription',
      label: 'Missing flow description',
      description: 'Descriptions are useful for documentation purposes. It is recommended to provide information about where it is used and what it will do.',
      type: 'flow',
      supportedFlowTypes: FlowType.allTypes,
      docRefs: []
    });
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, false);
    }
    const missingFlowDescription = !flow.xmldata.description;
    return new RuleResult(this, missingFlowDescription, missingFlowDescription ? 'undefined' : undefined);
  }
}
