import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowVariable} from '../models/FlowVariable';
import {BuildFlow} from './BuildFlow';

export function FixFlows(flows: Flow[]) {

  const processedFlows: Flow[] = [];
  for (const flow of flows) {
    const unusedVariableReferences = flow.unusedVariables.map(unusedVariable => unusedVariable.name);
    const unconnectedElementsReferences = flow.unconnectedElements.map(unconnectedElement => unconnectedElement.name);
    const nodesToBuild = flow.nodes.filter(node => {
        switch (node.nodeType) {
          case 'variable':
            const nodeVar = node as FlowVariable;
            if (!unusedVariableReferences.includes(nodeVar.name)) {
              return node;
            }
            break;
          case 'element':
            const nodeElement = node as FlowElement;
            if (!unconnectedElementsReferences.includes(nodeElement.name)) {
              return node;
            }
            break;
          case 'metadata':
            return node;
        }
      }
    );
    processedFlows.push(new Flow(BuildFlow(nodesToBuild)));
  }
  return processedFlows;
}
