import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {FlowNode} from '../models/FlowNode';
import {FlowType} from '../models/FlowType';
import {FlowVariable} from '../models/FlowVariable';
import {RuleCommon} from '../models/RuleCommon';
import * as core from '../../index';


export class UnusedVariable extends RuleCommon implements IRuleDefinition{

  constructor() {
    super({
      name: 'UnusedVariable',
      label: 'Unused Variable',
      description: "To maintain the efficiency and manageability of your Flow, it's advisable to avoid including unconnected variables that are not in use.",
      type: 'pattern',
      supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
      docRefs: [],
      isConfigurable: false
    });
  }

  public execute(flow: core.Flow) : core.RuleResult {
    if(flow.type[0] === 'Survey'){
      return new core.RuleResult( this, []);
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
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult( this, results);

  }

}
