import { Flow } from "../models/Flow";
import { ResultDetails } from "../models/ResultDetails";
import { ScanResult } from "../models/ScanResult";

/**
 * Export scan results to SARIF v2.1.0
 * Uses real fsPath → GitHub clickable
 * Falls back to virtual URI in browser
 */
export function exportSarif(results: ScanResult[]): string {
  const runs = results.map((result) => {
    const flow = result.flow;
    const uri = getUri(flow);

    return {
      artifacts: [{ location: { uri }, sourceLanguage: "xml" }],
      results: result.ruleResults
        .filter(r => r.occurs)
        .flatMap(r => r.details.map(d => ({
          level: mapSeverity(r.severity),
          locations: [{
            physicalLocation: {
              artifactLocation: { index: 0, uri },
              region: mapRegion(d),
            },
          }],
          message: { text: r.errorMessage || `${r.ruleName} in ${d.name}` },
          properties: {
            element: d.name,
            flow: flow.name,
            type: d.type,
            ...d.details,
          },
          ruleId: r.ruleName,
        }))),
      tool: {
        driver: {
          informationUri: "https://github.com/Flow-Scanner/lightning-flow-scanner-core",
          name: "Lightning Flow Scanner",
          rules: result.ruleResults
            .filter(r => r.occurs)
            .map(r => ({
              defaultConfiguration: { level: mapSeverity(r.severity) },
              fullDescription: { text: r.ruleDefinition.description || "" },
              helpUri: r.ruleDefinition.helpUrl,
              id: r.ruleName,
              shortDescription: { text: r.ruleDefinition.description || r.ruleName },
            })),
          version: "1.0.0",
        },
      },
    };
  });

  return JSON.stringify({
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    runs,
    version: "2.1.0",
  }, null, 2);
}

// ─── Private Helpers ───
function getUri(flow: Flow): string {
  return flow.fsPath
    ? flow.fsPath.replace(/\\/g, "/")
    : `flows/${flow.name}.flow-meta.xml`;
}

function mapRegion(detail: ResultDetails): any {
  if (detail.metaType === "node" && (detail.details as any).locationY != null) {
    return {
      startColumn: (detail.details as any).locationX || 1,
      startLine: Math.max(1, (detail.details as any).locationY),
    };
  }
  return { startColumn: 1, startLine: 1 };
}

function mapSeverity(sev: string): "error" | "note" | "warning" {
  switch (sev?.toLowerCase()) {
    case "info":
    case "note": return "note"; case "warning": return "warning";
    default: return "error";
  }
}