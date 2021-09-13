import {Override} from "./Override";

export class FlowScanOverrides {
  public flowName: string;
  public results: Override[];

  constructor(flowName, results){
    this.flowName = flowName;
    this.results = results;
  }
}
