import { BuildFlow } from './BuildFlow';
import * as core from '../internals/internals';

export function FixFlows(flow: core.Flow, ruleResults: core.RuleResult[]): core.Flow {

  const unusedVariableRes = ruleResults.find((r) => r.ruleName === 'UnusedVariable');
  const unusedVariableReferences = (unusedVariableRes && unusedVariableRes.details && unusedVariableRes.details.length > 0) ? unusedVariableRes.details.map((d) => d.name) : [];
  const unconnectedElementsRes = ruleResults.find((r) => r.ruleName === 'UnconnectedElement');
  const unconnectedElementsReferences = (unconnectedElementsRes && unconnectedElementsRes.details && unconnectedElementsRes.details.length > 0) ? unconnectedElementsRes.details.map((d) => d.name) : [];
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
      case 'resource':
        return node;
    }
  }
  );
  let xmldata = BuildFlow(nodesToBuild);
  const newFlow = new core.Flow(
    flow.fsPath, xmldata
  );
  return newFlow;
}
