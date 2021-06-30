import {FixFlows} from './main/libs/FixFlows';
import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {ScanResult} from './main/models/ScanResult';
import {ScanOptions} from './main/models/ScanOptions';

export function scan(flows :Flow[], scanOptions : ScanOptions): ScanResult[] {

  return ScanFlows(flows, scanOptions);
}

export function fix(flows :Flow[]): Flow[] {

  return FixFlows(flows);
}
