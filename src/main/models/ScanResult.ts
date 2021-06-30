import {Flow} from './Flow';
import {FlowResult} from './FlowResult';

export class ScanResult {

  constructor(flow: Flow, scanResults: FlowResult[]) {
    this.flow = flow;
    this.scanResults = scanResults;
  }

  public flow: Flow;
  public scanResults: FlowResult[];
}
