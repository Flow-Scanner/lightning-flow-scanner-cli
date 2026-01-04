import { Violation } from "./Violation";

export interface FlatViolation extends Omit<Violation, 'details'> {
  flowFile: string;
  flowName: string;
  ruleId: string; // Canonical rule ID (e.g., "dml-in-loop")
  ruleName: string; // Legacy class name (e.g., "DMLStatementInLoop")
  severity: string;
  message?: string; // Custom message overriding the default rule description
  messageUrl?: string; // URL to custom documentation
  dataType?: string;
  locationX?: string;
  locationY?: string;
  connectsTo?: string;
  expression?: string;
}