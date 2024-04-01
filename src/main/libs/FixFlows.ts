import { BuildFlow } from './BuildFlow';
import * as core from '../internals/internals';

export function FixFlows(flow: core.Flow, ruleResults: core.RuleResult[]): core.Flow {

  const flowResults: core.ScanResult[] = [];
  const unusedVariableReferences = ruleResults.find((r) => r.ruleName === 'UnusedVariable').details.map((d) => d.name);
  const unconnectedElementsReferences = ruleResults.find((r) => r.ruleName === 'UnconnectedElement').details.map((d) => d.name);
  const nodesToBuild = flow.elements.filter(node => {
    switch (node.metaType) {
      case 'variable':
        const nodeVar = node as core.FlowVariable;
        if (!unusedVariableReferences.includes(nodeVar.name)) {
          return node;
        }
        break;
      case 'node':
        const nodeElement = node as core.FlowNode;
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
  return flow;
}
