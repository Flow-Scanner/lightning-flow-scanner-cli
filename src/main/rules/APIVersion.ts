import * as core from '../internals/internals';
import { RuleCommon } from '../models/RuleCommon';

export class APIVersion extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'APIVersion',
      label: 'Outdated API Version',
      description: "Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: true, 
      autoFixable: false
    });
  }

  public execute(flow: core.Flow, options?: { expression: string }): core.RuleResult {

    let flowAPIVersionNumber: number;
    if (flow.xmldata.apiVersion) {
      const flowAPIVersion = flow.xmldata.apiVersion;
      flowAPIVersionNumber = +flowAPIVersion;
    }
    if (flowAPIVersionNumber) {
      if (options && options.expression) {
        const expressionEvaluation = eval(flowAPIVersionNumber + options.expression);
        return (!expressionEvaluation ?
          new core.RuleResult(this, [new core.ResultDetails(new core.FlowAttribute(!expressionEvaluation ? ('' + flowAPIVersionNumber) : undefined, "apiVersion", options.expression))]) :
          new core.RuleResult(this, []));
      } else {
        return new core.RuleResult(this, []);
      }
    } else {
      return new core.RuleResult(this, [new core.ResultDetails(new core.FlowAttribute('API Version <49', "apiVersion", "<49"))]);
    }
  }
}
