import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowVariable} from '../models/FlowVariable';
import {UnconnectedElements} from '../rules/UnconnectedElements';
import {UnusedVariables} from '../rules/UnusedVariables';
import {BuildFlow} from './BuildFlow';

export function FixFlows(flows: Flow[]) {

  for (const flow of flows) {
    const unconnectedElements = new UnconnectedElements().execute(flow);
    const unusedVariables = new UnusedVariables().execute(flow);
    const unusedVariableReferences = unusedVariables ? unusedVariables.map(unusedVariable => unusedVariable.name) : [];
    const unconnectedElementsReferences = unconnectedElements ? unconnectedElements.map(unconnectedElement => unconnectedElement.name) : [];
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
    flow.processedData = BuildFlow(nodesToBuild);
  }
  return flows;
}
