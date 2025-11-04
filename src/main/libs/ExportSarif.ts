import { Flow } from "../models/Flow";
import { ResultDetails } from "../models/ResultDetails";
import { ScanResult } from "../models/ScanResult";

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
              region: mapRegion(d, result.flow.toXMLString() || "")
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

function getUri(flow: Flow): string {
  return flow.fsPath
    ? flow.fsPath.replace(/\\/g, "/")
    : `flows/${flow.name}.flow-meta.xml`;
}

function mapRegion(detail: ResultDetails, rawXml: string = ""): any {
  if (!rawXml) return { startLine: 1, startColumn: 1 };

  const lines = rawXml.split("\n");
  const name = detail.name;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`<name>${name}</name>`)) {
      return {
        startLine: i + 1,
        startColumn: lines[i].indexOf(name) + 1
      };
    }
  }
  return { startLine: 1, startColumn: 1 };
}
function mapSeverity(sev: string): "error" | "note" | "warning" {
  switch (sev?.toLowerCase()) {
    case "info":
    case "note": return "note";
    case "warning": return "warning";
    default: return "error";
  }
}