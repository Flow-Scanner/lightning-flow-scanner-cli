/* eslint-disable @typescript-eslint/no-explicit-any */
import { Violation } from "../models/Violation";
import { RuleResult } from "../models/RuleResult";
import { ScanResult } from "../models/ScanResult";

export interface FlatViolation {
  connectsTo?: string;
  dataType?: string;
  expression?: string;
  flowFile: string;
  flowName: string;
  locationX?: string;
  locationY?: string;
  metaType: string;
  name: string;
  ruleName: string;
  severity: string;
  type: string;
}

export function exportDetails(results: ScanResult[]): FlatViolation[] {
  const violations: FlatViolation[] = [];

  for (const result of results) {
    const flow = result.flow;
    const flowName = flow.label || flow.name;
    const flowFile = flow.fsPath
      ? flow.fsPath.replace(/\\/g, "/")
      : `${flow.name}.flow-meta.xml`;

    for (const rule of result.ruleResults as RuleResult[]) {
      if (!rule.occurs || !rule.details?.length) continue;

      const ruleName = rule.ruleDefinition.label || rule.ruleName;
      const severity = rule.severity ?? "error";

      for (const detail of rule.details as Violation[]) {
        const d = detail.details || {};

        violations.push({
          connectsTo: Array.isArray((d as any).connectsTo)
            ? (d as any).connectsTo.join("; ")
            : (d as any).connectsTo,
          dataType: (d as any).dataType,
          expression: (d as any).expression,
          flowFile,
          flowName,
          locationX: (d as any).locationX,
          locationY: (d as any).locationY,
          metaType: detail.metaType,
          name: detail.name,
          ruleName,
          severity,
          type: detail.type,
        });
      }
    }
  }

  return violations;
}