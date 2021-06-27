import {FixFlows} from './main/libs/FixFlows';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanOptions} from './main/models/ScanOptions';

export function scan(flows :Flow[], scanOptions : ScanOptions): Flow[] {

  return ScanFlows(flows, scanOptions);
}

export function fix(flows :Flow[]): Flow[] {

  return FixFlows(flows);
}
