import * as core from "../internals/internals";

export function fix(results: core.ScanResult[], ruleOptions?: Map<string, unknown>): core.ScanResult[] {
  const newResults: core.ScanResult[] = [];

  for (const result of results) {
    if (!result.ruleResults || result.ruleResults.length === 0) continue;

    const fixables: core.RuleResult[] = result.ruleResults.filter(
      (r) =>
        (r.ruleName === "UnusedVariable" && r.occurs) ||
        (r.ruleName === "UnconnectedElement" && r.occurs) ||
        (r.ruleName === "AutoLayout" && r.occurs) ||
        (r.ruleName === "APIVersion" && r.occurs)
    );

    if (fixables.length === 0) continue;

    // Handle AutoLayout fix separately (modifies metadata, not elements)
    const autoLayoutFix = fixables.find((r) => r.ruleName === "AutoLayout");
    if (autoLayoutFix) {
      applyAutoLayoutFix(result.flow);
    }

    // Handle APIVersion fix (modifies apiVersion attribute)
    const apiVersionFix = fixables.find((r) => r.ruleName === "APIVersion");
    if (apiVersionFix) {
      const options = ruleOptions?.get("invalid-api-version") ?? ruleOptions?.get("APIVersion");
      applyAPIVersionFix(result.flow, options as { expression?: string } | undefined);
    }

    // Handle element-based fixes (UnusedVariable, UnconnectedElement)
    // These modify xmldata in place to preserve element order and formatting
    const elementFixables = fixables.filter((r) => r.ruleName !== "AutoLayout");
    if (elementFixables.length > 0) {
      applyElementFixes(result.flow, elementFixables);
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

/**
 * Parse an API version expression and return the target version for auto-fix.
 * Fixable expressions: >= N, === N, > N
 * Returns undefined for unfixable expressions (<, <=, !==)
 */
function parseAPIVersionExpression(expression?: string): number | undefined {
  if (!expression) {
    // Default behavior: >= 50
    return 50;
  }

  const match = expression.match(/^\s*(>=|<=|>|<|===|!==)\s*(\d+)\s*$/);
  if (!match) return undefined;

  const [, operator, versionStr] = match;
  const version = parseInt(versionStr, 10);

  switch (operator) {
    case '>=':
    case '===':
      return version;
    case '>':
      return version + 1;
    // These don't have a clear target version
    case '<':
    case '<=':
    case '!==':
    default:
      return undefined;
  }
}

function applyAPIVersionFix(flow: core.Flow, options?: { expression?: string }): void {
  if (!flow.xmldata) return;

  const targetVersion = parseAPIVersionExpression(options?.expression);
  if (targetVersion === undefined) return;

  flow.xmldata.apiVersion = targetVersion.toString();
}

/**
 * Apply element-based fixes (UnusedVariable, UnconnectedElement) by modifying xmldata in place.
 * This preserves element order and formatting from the original file.
 */
function applyElementFixes(flow: core.Flow, ruleResults: core.RuleResult[]): void {
  if (!flow.xmldata) return;

  const unusedVariableRes = ruleResults.find((r) => r.ruleName === "UnusedVariable");
  const unusedVariableNames = new Set(
    unusedVariableRes?.details?.map((d) => d.name) ?? []
  );

  const unconnectedElementsRes = ruleResults.find((r) => r.ruleName === "UnconnectedElement");
  const unconnectedElementNames = new Set(
    unconnectedElementsRes?.details?.map((d) => d.name) ?? []
  );

  // Remove unused variables from xmldata
  if (unusedVariableNames.size > 0) {
    for (const varTag of core.Flow.VARIABLE_TAGS) {
      removeElementsByName(flow.xmldata, varTag, unusedVariableNames);
    }
  }

  // Remove unconnected elements from xmldata
  if (unconnectedElementNames.size > 0) {
    for (const nodeTag of core.Flow.NODE_TAGS) {
      removeElementsByName(flow.xmldata, nodeTag, unconnectedElementNames);
    }
  }

  // Update the flow's elements array to match the modified xmldata
  flow.preProcessNodes();
}

/**
 * Remove elements from xmldata by name.
 * Handles both single element and array cases.
 */
function removeElementsByName(
  xmldata: Record<string, unknown>,
  tagName: string,
  namesToRemove: Set<string>
): void {
  const elements = xmldata[tagName];
  if (!elements) return;

  if (Array.isArray(elements)) {
    const filtered = elements.filter((el: any) => !namesToRemove.has(el?.name));
    if (filtered.length === 0) {
      delete xmldata[tagName];
    } else if (filtered.length === 1) {
      // Keep as single element if only one remains (matches original format)
      xmldata[tagName] = filtered[0];
    } else {
      xmldata[tagName] = filtered;
    }
  } else if (typeof elements === 'object' && elements !== null) {
    // Single element case
    if (namesToRemove.has((elements as any).name)) {
      delete xmldata[tagName];
    }
  }
}

/**
 * @deprecated Use fix() instead which modifies flows in place.
 * Kept for backward compatibility.
 */
export function FixFlows(flow: core.Flow, ruleResults: core.RuleResult[]): core.Flow {
  // Create a shallow clone of xmldata to avoid modifying the original
  const clonedXmldata = JSON.parse(JSON.stringify(flow.xmldata));
  const clonedFlow = new core.Flow(flow.fsPath, clonedXmldata);

  applyElementFixes(clonedFlow, ruleResults);

  return clonedFlow;
}