import { FlowNode } from '../models/FlowNode';
import { FlowVariable } from '../models/FlowVariable';
import { UnconnectedElement } from '../rules/UnconnectedElement';
import { UnusedVariable } from '../rules/UnusedVariable';
import { BuildFlow } from './BuildFlow';
import * as core from '../../index';

export function FixFlows(flows: core.Flow[]): core.ScanResult[] {

  const flowResults: core.ScanResult[] = [];
  for (const flow of flows) {
    const unconnectedElementsResult: core.RuleResult = new UnconnectedElement().execute(flow);
    const unusedVariablesResult: core.RuleResult = new UnusedVariable().execute(flow);
    const ruleResults: core.RuleResult[] = [unusedVariablesResult, unconnectedElementsResult];
    const unusedVariableReferences = unusedVariablesResult.details ? (unusedVariablesResult.details as core.ResultDetails[]).map(unusedVariable => unusedVariable.name) : [];
    const unconnectedElementsReferences = unconnectedElementsResult.details ? (unconnectedElementsResult.details as core.ResultDetails[]).map(unconnectedElement => unconnectedElement.name) : [];
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
    flowResults.push(new core.ScanResult(flow, ruleResults));
  }
  return flowResults;
}
