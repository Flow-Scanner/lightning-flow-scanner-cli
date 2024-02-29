import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import Flow from '../models/Flow';
import { FlowType } from '../models/FlowType';
import RuleResult from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';
import { FlowAttribute } from '../models/FlowAttribute';

export class APIVersion extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'APIVersion',
      label: 'Outdated API Version',
      description: "Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.",
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
        return (!expressionEvaluation ?
          new RuleResult(this, [new ResultDetails(new FlowAttribute(!expressionEvaluation ? ('' + flowAPIVersionNumber) : undefined, "apiVersion", options.expression))]) :
          new RuleResult(this, []));
      } else {
        return new RuleResult(this, []);
      }
    } else {
      return new RuleResult(this, [new ResultDetails(new FlowAttribute('API Version <49', "apiVersion", "<49"))]);
    }
  }
}
