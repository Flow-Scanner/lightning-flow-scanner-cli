import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';

export class APIVersion extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'APIVersion',
      label: 'Old API version',
      description: 'Newer API components may cause older versions of Flows to start behaving incorrectly due to differences in the underlying mechanics. The Api Version has been available as an attribute on the Flow since API v50.0. It is recommended to limit variation between API versions and to maintain them on a regular basis.',
      type: 'flow',
      supportedFlowTypes: FlowType.allTypes,
    });
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {

    let flowAPIVersionNumber: number;
    if (flow.xmldata.apiVersion && flow.xmldata.apiVersion[0]) {
      const flowAPIVersion = flow.xmldata.apiVersion[0];
      flowAPIVersionNumber = +flowAPIVersion;
    }
    if (flowAPIVersionNumber) {
      if (options && options.expression) {
        const expressionEvaluation = eval(flowAPIVersionNumber + options.expression);
        return new RuleResult(this, !expressionEvaluation, !expressionEvaluation ? ('' + flowAPIVersionNumber) : undefined);
      } else {
        return new RuleResult(this, false);
      }
    } else {
      return new RuleResult(this, true, 'API Version <50');
    }
  }
}
