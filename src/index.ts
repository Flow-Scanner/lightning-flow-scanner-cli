import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {RuleOptions} from './main/models/RuleOptions';

export function scan(flows :Flow[], ruleOptions : RuleOptions): Flow[] {

  return ScanFlows(flows, ruleOptions);
}
