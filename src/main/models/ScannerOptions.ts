import {FlowScanOverrides} from './FlowScanOverrides';

export class ScannerOptions {
  public activeRules: string[];
  public overrides: FlowScanOverrides[];

  constructor(activeRules? : string[], overrides? : FlowScanOverrides[]){
    this.activeRules = activeRules;
    this.overrides = overrides;
  }
}
