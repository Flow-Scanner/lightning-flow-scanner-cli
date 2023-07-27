import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { RuleDefinitions } from '../store/RuleDefinitions';
import * as ts from "typescript";

export class APIVersion extends RuleCommon implements IRuleDefinition {

  constructor() {
    super(RuleDefinitions.APIVersion, 'flow', FlowType.allTypes);
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {

    let flowAPIVersionNumber: number;
    if(flow.xmldata.apiVersion && flow.xmldata.apiVersion[0]){
      const flowAPIVersion = flow.xmldata.apiVersion[0];
      flowAPIVersionNumber = +flowAPIVersion;
    }
    
    if (flowAPIVersionNumber) {
      if (options && options.expression) {
        const expressionEvaluation = eval(flowAPIVersionNumber + options.expression);
        return new RuleResult(!expressionEvaluation, this.name, this.type, this.severity, !expressionEvaluation ? (''+flowAPIVersionNumber) : undefined);
      } else {
        return new RuleResult(false, this.name, this.type, this.severity);
      }
    } else {
      return new RuleResult(true, this.name, this.type, this.severity, 'API Version <50');
    }




  }
}
