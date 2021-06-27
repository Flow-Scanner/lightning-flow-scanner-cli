import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';

export function scan(flows, ruleOptions): Flow[] {

  const processedFlows: Flow[] = [];
  for(const flow of flows){
    processedFlows.push( new Flow(flow));
  }
  return ScanFlows(processedFlows, ruleOptions);
}
