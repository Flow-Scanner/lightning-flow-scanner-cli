import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowVariable} from '../models/FlowVariable';
import {RuleResult} from '../models/RuleResult';
import {ScanResult} from '../models/ScanResult';
import {UnconnectedElements} from '../rules/UnconnectedElements';
import {UnusedVariables} from '../rules/UnusedVariables';
import {BuildFlow} from './BuildFlow';

export function FixFlows(flows: Flow[]) : ScanResult[] {

  const flowResults : ScanResult[] = [];
  for (const flow of flows) {
    const unconnectedElementsResult : RuleResult = new UnconnectedElements().execute(flow);
    const unusedVariablesResult : RuleResult = new UnusedVariables().execute(flow);
    const ruleResults: RuleResult[] = [unusedVariablesResult, unconnectedElementsResult];
    // @ts-ignore
    const unusedVariableReferences = unusedVariablesResult.details ? unusedVariablesResult.details.map(unusedVariable => unusedVariable.name) : [];
    // @ts-ignore
    const unconnectedElementsReferences = unconnectedElementsResult.details ? unconnectedElementsResult.details.map(unconnectedElement => unconnectedElement.name) : [];
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
    flow.xmldata['Flow'] = BuildFlow(nodesToBuild);
    flow.preProcessNodes();
    flowResults.push(new ScanResult(flow, ruleResults));
  }
  return flowResults;
}
