import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { RuleDefinitions } from '../store/RuleDefinitions';
import * as ts from "typescript";

export class APIVersion extends RuleCommon implements IRuleDefinition {

  constructor() {
    super(RuleDefinitions.APIVersion, FlowType.allTypes);
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {

    const flowAPIVersion = flow.xmldata.apiVersion[0];
    var flowAPIVersionNumber: number = +flowAPIVersion;

    if (flowAPIVersionNumber) {
      if (options && options.expression) {
        const expressionEvaluation = eval(flowAPIVersionNumber + options.expression);
        return new RuleResult(!expressionEvaluation, this.name, 'flow', this.severity, !expressionEvaluation ? (''+flowAPIVersionNumber) : undefined);
      } else {
        return new RuleResult(false, this.name, 'flow', this.severity);
      }
    } else {
      return new RuleResult(true, this.name, 'flow', this.severity, 'API Version <50');
    }




  }
}
