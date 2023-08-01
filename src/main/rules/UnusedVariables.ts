import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowType} from '../models/FlowType';
import {FlowVariable} from '../models/FlowVariable';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';

export class UnusedVariables extends RuleCommon implements IRuleDefinition{

  constructor() {
    super({
      name: 'UnusedVariables',
      label: 'Unused variables',
      description: 'Removing unconnected variables which are not being used by the Flow makes your Flow more efficient and maintainable.',
      type: 'pattern',
      supportedFlowTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes]
    });
  }

  public execute(flow: Flow) : RuleResult {
    if(flow.type[0] === 'Survey'){
      return new RuleResult( this, false);
    }
    const unusedVariables: FlowVariable[] = [];
    for (const variable of flow.nodes.filter(node => node instanceof FlowVariable) as FlowVariable[]) {
      // first check if any inside of flow elements
      const variableName = variable.name;
      if ([...JSON.stringify(flow.nodes.filter(node => node instanceof FlowElement)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index).length === 0) {
        // if none found check in other flow variables
        const insideCounter = [...JSON.stringify(variable).matchAll(new RegExp(variable.name, 'gi'))].map(a => a.index);
        const variableUsage = [...JSON.stringify(flow.nodes.filter(node => node instanceof FlowVariable)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index);
        if (variableUsage.length === insideCounter.length) {
          unusedVariables.push(variable);
        }
      }
    }
    return new RuleResult( this, unusedVariables.length > 0, unusedVariables);
  }

}
