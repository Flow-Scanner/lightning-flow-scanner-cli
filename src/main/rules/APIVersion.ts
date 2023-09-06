import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';
import { FlowAttribute } from '../models/FlowAttribute';

export class APIVersion extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'APIVersion',
      label: 'Old API version',
      description: 'Newer API components may cause older versions of Flows to start behaving incorrectly due to differences in the underlying mechanics. The Api Version has been available as an attribute on the Flow Object since API v50.0. It is recommended to limit variation between API versions and to maintain them on a regular basis.',
      type: 'flow',
      supportedTypes: FlowType.allTypes(),
      docRefs: [],
      isConfigurable: true
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
        return new RuleResult(this, !expressionEvaluation, [new ResultDetails(new FlowAttribute(!expressionEvaluation ? ('' + flowAPIVersionNumber) : undefined, "apiVersion", options.expression))]);
      } else {
        return new RuleResult(this, false);
      }
    } else {
      return new RuleResult(this, true, [new ResultDetails(new FlowAttribute('API Version <50', "apiVersion", "<50"))]);
    }
  }
}
