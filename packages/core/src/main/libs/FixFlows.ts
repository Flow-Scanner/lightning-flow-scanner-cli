import * as core from "../internals/internals";
import { BuildFlow } from "./BuildFlow";

export function fix(results: core.ScanResult[]): core.ScanResult[] {
  const newResults: core.ScanResult[] = [];

  for (const result of results) {
    if (!result.ruleResults || result.ruleResults.length === 0) continue;

    const fixables: core.RuleResult[] = result.ruleResults.filter(
      (r) =>
        (r.ruleName === "UnusedVariable" && r.occurs) ||
        (r.ruleName === "UnconnectedElement" && r.occurs) ||
        (r.ruleName === "AutoLayout" && r.occurs)
    );

    if (fixables.length === 0) continue;

    // Handle AutoLayout fix separately (modifies metadata, not elements)
    const autoLayoutFix = fixables.find((r) => r.ruleName === "AutoLayout");
    if (autoLayoutFix) {
      applyAutoLayoutFix(result.flow);
    }

    // Handle element-based fixes (UnusedVariable, UnconnectedElement)
    const elementFixables = fixables.filter((r) => r.ruleName !== "AutoLayout");
    if (elementFixables.length > 0) {
      const newFlow = FixFlows(result.flow, elementFixables);
      const hasRemainingElements = newFlow.elements && newFlow.elements.length > 0;
      if (hasRemainingElements) {
        result.flow = newFlow;
      }
    }

    newResults.push(result);
  }

  return newResults;
}

function applyAutoLayoutFix(flow: core.Flow): void {
  if (!flow.xmldata) return;

  // Ensure processMetadataValues is an array
  if (!flow.xmldata.processMetadataValues) {
    flow.xmldata.processMetadataValues = [];
  } else if (!Array.isArray(flow.xmldata.processMetadataValues)) {
    flow.xmldata.processMetadataValues = [flow.xmldata.processMetadataValues];
  }

  // Find existing CanvasMode entry
  const canvasModeIndex = flow.xmldata.processMetadataValues.findIndex(
    (mdv: any) => mdv.name === "CanvasMode"
  );

  const autoLayoutValue = {
    name: "CanvasMode",
    value: { stringValue: "AUTO_LAYOUT_CANVAS" }
  };

  if (canvasModeIndex >= 0) {
    // Update existing entry
    flow.xmldata.processMetadataValues[canvasModeIndex] = autoLayoutValue;
  } else {
    // Add new entry
    flow.xmldata.processMetadataValues.push(autoLayoutValue);
  }

  // Update the flow's processMetadataValues property
  flow.processMetadataValues = flow.xmldata.processMetadataValues;
}

export function FixFlows(flow: core.Flow, ruleResults: core.RuleResult[]): core.Flow {
  const unusedVariableRes = ruleResults.find((r) => r.ruleName === "UnusedVariable");
  const unusedVariableNames = new Set(
    unusedVariableRes?.details?.map((d) => d.name) ?? []
  );

  const unconnectedElementsRes = ruleResults.find((r) => r.ruleName === "UnconnectedElement");
  const unconnectedElementNames = new Set(
    unconnectedElementsRes?.details?.map((d) => d.name) ?? []
  );

  const nodesToKeep = flow.elements?.filter((node) => {
    switch (node.metaType) {
      case "attribute":
      case "resource":
        return true;
      case "node": {
        const nodeElement = node as core.FlowNode;
        return !unconnectedElementNames.has(nodeElement.name);
      }
      case "variable": {
        const nodeVar = node as core.FlowVariable;
        return !unusedVariableNames.has(nodeVar.name);
      }
      default:
        return false;
    }
  }) ?? [];

  const xmldata = BuildFlow(nodesToKeep);
  return new core.Flow(flow.fsPath, xmldata);
}