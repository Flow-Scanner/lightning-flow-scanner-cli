import {Flow} from "../models/Flow";
import {FlowElement} from "../models/FlowElement";
import {FlowVariable} from "../models/FlowVariable";
import {Rule} from "../models/Rule";
import * as rules from "../data/rules.json";

export class UnusedVariables extends Rule{

  constructor(
  ) {
    const rule = rules.rules.find(rule => rule.name === "UnusedVariables");
    super(rule.name, rule.label, rule.text);
  }


  public execute(flow: Flow) {
        const unusedVariables : FlowVariable[] = [];
        for (const variable of flow.nodes.filter(node => node instanceof FlowVariable) as FlowVariable[]) {
            // first check if any inside of flow elements
            const variableName = variable.name;
            if ([...JSON.stringify(flow.nodes.filter(node => node instanceof FlowElement)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index).length === 0) {
                // if none found check in other flow variables
                const insideCounter = [...JSON.stringify(variable).matchAll(new RegExp(variable.name, 'gi'))].map(a => a.index);
                const variableUsage = [...JSON.stringify(flow.nodes.filter(node => node instanceof FlowVariable)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index);
                if(variableUsage.length === insideCounter.length){
                    unusedVariables.push(variable);
                }
            }
        }
        return  unusedVariables;
    }

}
