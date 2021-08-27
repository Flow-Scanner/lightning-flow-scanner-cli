import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowVariable} from '../models/FlowVariable';
import {UnconnectedElements} from '../rules/UnconnectedElements';
import {UnusedVariables} from '../rules/UnusedVariables';
import {BuildFlow} from './BuildFlow';
import {ScanResult} from "../models/ScanResult";
import {RuleResult} from "../models/RuleResult";

export function FixFlows(flows: Flow[]) : ScanResult[] {

  const flowResults : ScanResult[] = [];
  for (const flow of flows) {
    const unconnectedElementsResult : RuleResult = new UnconnectedElements().execute(flow);
    const unusedVariablesResult : RuleResult = new UnusedVariables().execute(flow);
    const ruleResults: RuleResult[] = [unusedVariablesResult, unconnectedElementsResult];
    // @ts-ignore
    const unusedVariableReferences = unusedVariablesResult.results ? unusedVariablesResult.results.map(unusedVariable => unusedVariable.name) : [];
    // @ts-ignore
    const unconnectedElementsReferences = unconnectedElementsResult.results ? unconnectedElementsResult.results.map(unconnectedElement => unconnectedElement.name) : [];
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
    flowResults.push(new ScanResult(flow, ruleResults));
  }
  return flowResults;
}
