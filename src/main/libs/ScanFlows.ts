import {Flow} from '../models/Flow';
import {ScanOptions} from '../models/ScanOptions';
import {DMLStatementInLoop} from '../rules/DMLStatementInLoop';
import {DuplicateDMLOperationsByNavigation} from '../rules/DuplicateDMLOperationsByNavigation';
import {HardcodedIds} from '../rules/HardcodedIds';
import {MissingFaultPath} from '../rules/MissingFaultPath';
import {MissingFlowDescription} from '../rules/MissingFlowDescription';
import {MissingNullHandler} from '../rules/MissingNullHandler';
import {UnconnectedElements} from '../rules/UnconnectedElements';
import {UnusedVariables} from '../rules/UnusedVariables';
import {ScanResult} from "../models/ScanResult";

export function ScanFlows(flows: Flow[], options: ScanOptions) : Flow[] {

  for (const flow of flows) {
    if (options.dmlStatementInLoop) {
      flow.scanResults.push(new ScanResult('DMLStatementInLoop', new DMLStatementInLoop().execute(flow)));
    }
    if (options.duplicateDMLOperations) {
      flow.scanResults.push(new ScanResult('DuplicateDMLOperationsByNavigation', new DuplicateDMLOperationsByNavigation().execute(flow)));
    }
    if (options.hardcodedIds) {
      flow.scanResults.push(new ScanResult('HardcodedIds', new HardcodedIds().execute(flow)));
    }
    if (options.missingDescription) {
      flow.scanResults.push(new ScanResult('MissingFlowDescription', new MissingFlowDescription().execute(flow)));
    }
    if (options.missingFaultPaths) {
      flow.scanResults.push(new ScanResult('MissingFaultPath', new MissingFaultPath().execute(flow)));
    }
    if (options.missingNullHandlers) {
      flow.scanResults.push(new ScanResult('MissingNullHandler', new MissingNullHandler().execute(flow)));
    }
    if (options.unconnectedElements) {
      flow.scanResults.push(new ScanResult('UnconnectedElements', new UnconnectedElements().execute(flow)));
    }
    if (options.unusedVariables) {
      flow.scanResults.push(new ScanResult('UnusedVariables', new UnusedVariables().execute(flow)));
    }
  }
  return flows;
}
