import { Violation } from "./Violation";

export interface FlatViolation extends Omit<Violation, 'details'> {
  flowFile: string;
  flowName: string;
  ruleName: string;
  severity: string;
  message?: string; // Custom message overriding the default rule description
  dataType?: string;
  locationX?: string;
  locationY?: string;
  connectsTo?: string;
  expression?: string;
}