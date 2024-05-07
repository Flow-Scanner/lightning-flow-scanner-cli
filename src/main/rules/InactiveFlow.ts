import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class InactiveFlow extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'InactiveFlow',
      label: 'Inactive Flow',
      description: 'It\'s better to delete flows that are no longer used rather than have them be inactive. Inactive flows can still delete records when testing them, and parent flows will run an inactive subflow if no active version is found.',
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: true, 
      autoFixable: false
    },
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const inactiveFlows = [];
    for (const node of flow.elements) {
        const nodeElementString = JSON.stringify(node.element);
        if (node.subtype == "status" && nodeElementString != '\"Active\"') {
            inactiveFlows.push(node);
        }
    }
    let results = [];
    for (const det of inactiveFlows) {
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }
}