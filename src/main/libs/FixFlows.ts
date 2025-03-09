import { BuildFlow } from "./BuildFlow";
import * as core from "../internals/internals";

export function fix(results: core.ScanResult[]): core.ScanResult[] {
  const newResults: core.ScanResult[] = [];
  for (const result of results) {
    if (result.ruleResults && result.ruleResults.length > 0) {
      const fixables: core.RuleResult[] = result.ruleResults.filter(
        (r) =>
          (r.ruleName === "UnusedVariable" && r.occurs) ||
          (r.ruleName === "UnconnectedElement" && r.occurs) // TODO: this should be rule.occurs && rule.ruleDefinition.fixable
      );
      if (fixables?.length > 0) {
        const newFlow: core.Flow = FixFlows(result.flow, fixables);
        result.flow = newFlow;
        newResults.push(result);
      }
    }
  }

  return newResults;
}

export function FixFlows(flow: core.Flow, ruleResults: core.RuleResult[]): core.Flow {
  // TODO: this should be defined on the rule
  const unusedVariableRes = ruleResults.find((r) => r.ruleName === "UnusedVariable");
  const unusedVariableReferences =
    unusedVariableRes && unusedVariableRes.details && unusedVariableRes.details.length > 0
      ? unusedVariableRes.details.map((d) => d.name)
      : [];
  const unconnectedElementsRes = ruleResults.find((r) => r.ruleName === "UnconnectedElement");
  const unconnectedElementsReferences =
    unconnectedElementsRes &&
    unconnectedElementsRes.details &&
    unconnectedElementsRes.details.length > 0
      ? unconnectedElementsRes.details.map((d) => d.name)
      : [];
  const nodesToBuild = flow.elements?.filter((node) => {
    switch (node.metaType) {
      case "variable": {
        const nodeVar = node as core.FlowVariable;
        if (!unusedVariableReferences.includes(nodeVar.name)) {
          return node;
        }
        break;
      }
      case "node": {
        const nodeElement = node as core.FlowNode;
        if (!unconnectedElementsReferences.includes(nodeElement.name)) {
          return node;
        }
        break;
      }
      case "metadata":
      case "resource":
        return node;
    }
  });
  const xmldata = BuildFlow(nodesToBuild);
  const newFlow = new core.Flow(flow.fsPath, xmldata);
  return newFlow;
}
