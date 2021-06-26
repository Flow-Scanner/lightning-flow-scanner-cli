import {ScanFlows} from './main/libs/ScanFlows';
import {Flow} from './main/models/Flow';
import {RuleOptions} from './main/models/RuleOptions';

export function scan(flow) {

  const testFlow = new Flow(flow);
  const options = new RuleOptions(true, true, true,
    true, true, true, true, true);

  return ScanFlows([testFlow], options);
}
