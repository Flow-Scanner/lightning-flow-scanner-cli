import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowNode} from '../models/FlowNode';
import {FlowType} from '../models/FlowType';
import {FlowVariable} from '../models/FlowVariable';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';

export class UnusedVariables extends RuleCommon implements IRuleDefinition{

  constructor() {
    super({
      name: 'UnusedVariables',
      label: 'Unused variables',
      description: 'Removing unconnected variables which are not being used by the Flow makes your Flow more efficient and maintainable.',
      type: 'pattern',
      supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
      docRefs: [],
      isConfigurable: false
    });
  }

  public execute(flow: Flow) : RuleResult {
    if(flow.type[0] === 'Survey'){
      return new RuleResult( this, false);
    }
    const unusedVariables: FlowVariable[] = [];
    for (const variable of flow.elements.filter(node => node instanceof FlowVariable) as FlowVariable[]) {
      // first check if any inside of flow elements
      const variableName = variable.name;
      if ([...JSON.stringify(flow.elements.filter(node => node instanceof FlowNode)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index).length === 0) {
        // if none found check in other flow variables
        const insideCounter = [...JSON.stringify(variable).matchAll(new RegExp(variable.name, 'gi'))].map(a => a.index);
        const variableUsage = [...JSON.stringify(flow.elements.filter(node => node instanceof FlowVariable)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index);
        if (variableUsage.length === insideCounter.length) {
          unusedVariables.push(variable);
        }
      }
    }
    let results = [];
    for (const det of unusedVariables) {
      results.push(new ResultDetails(det));
    }
    return new RuleResult( this, unusedVariables.length > 0, results);

  }

}
