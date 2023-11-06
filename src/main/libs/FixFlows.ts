import { Flow } from '../models/Flow';
import { FlowNode } from '../models/FlowNode';
import { FlowVariable } from '../models/FlowVariable';
import { ResultDetails } from '../models/ResultDetails';
import { RuleResult } from '../models/RuleResult';
import { ScanResult } from '../models/ScanResult';
import { UnconnectedElement } from '../rules/UnconnectedElement';
import { UnusedVariable } from '../rules/UnusedVariable';
import { BuildFlow } from './BuildFlow';

export function FixFlows(flows: Flow[]): ScanResult[] {

  const flowResults: ScanResult[] = [];
  for (const flow of flows) {
    const unconnectedElementsResult: RuleResult = new UnconnectedElement().execute(flow);
    const unusedVariablesResult: RuleResult = new UnusedVariable().execute(flow);
    const ruleResults: RuleResult[] = [unusedVariablesResult, unconnectedElementsResult];
    const unusedVariableReferences = unusedVariablesResult.details ? (unusedVariablesResult.details as ResultDetails[]).map(unusedVariable => unusedVariable.name) : [];
    const unconnectedElementsReferences = unconnectedElementsResult.details ? (unconnectedElementsResult.details as ResultDetails[]).map(unconnectedElement => unconnectedElement.name) : [];
    const nodesToBuild = flow.elements.filter(node => {
      switch (node.metaType) {
        case 'variable':
          const nodeVar = node as FlowVariable;
          if (!unusedVariableReferences.includes(nodeVar.name)) {
            return node;
          }
          break;
        case 'node':
          const nodeElement = node as FlowNode;
          if (!unconnectedElementsReferences.includes(nodeElement.name)) {
            return node;
          }
          break;
        case 'metadata':
          return node;
      }
    }
    );
    flow.xmldata = BuildFlow(nodesToBuild);
    flow.preProcessNodes();
    flowResults.push(new ScanResult(flow, ruleResults));
  }
  return flowResults;
}
