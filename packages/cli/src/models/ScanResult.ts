export interface FlatViolation {
  flowName: string;
  flowApiName: string;
  flowUri: string;
  ruleId: string;
  ruleName: string;
  severity: string;
  type?: string;
  name?: string;
  lineNumber?: number;
  columnNumber?: number;
  metaType?: string;
  dataType?: string;
  locationX?: number;
  locationY?: number;
  connectsTo?: string;
  expression?: string;
}

export type ScanResult = {
  status: number;
  summary: {
    flowsNumber: number;
    results: number;
    message: string;
  };
  results: FlatViolation[];
};