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
      flow.dmlStatementInLoop = new DMLStatementInLoop().execute(flow);
      flow.scanResults.push(new ScanResult('DMLStatementInLoop', flow.dmlStatementInLoop));
    }
    if (options.duplicateDMLOperations) {
      flow.duplicateDMLOperationsByNavigation = new DuplicateDMLOperationsByNavigation().execute(flow);
      flow.scanResults.push(new ScanResult('DuplicateDMLOperationsByNavigation', flow.duplicateDMLOperationsByNavigation));
    }
    if (options.hardcodedIds) {
      flow.nodesWithHardcodedIds = new HardcodedIds().execute(flow);
      flow.scanResults.push(new ScanResult('HardcodedIds', flow.nodesWithHardcodedIds));
    }
    if (options.missingDescription) {
      flow.missingDescription = new MissingFlowDescription().execute(flow);
      flow.scanResults.push(new ScanResult('MissingFlowDescription', flow.missingDescription));
    }
    if (options.missingFaultPaths) {
      flow.missingFaultPaths = new MissingFaultPath().execute(flow);
      flow.scanResults.push(new ScanResult('MissingFaultPath', flow.missingFaultPaths));
    }
    if (options.missingNullHandlers) {
      flow.missingNullHandlers = new MissingNullHandler().execute(flow);
      flow.scanResults.push(new ScanResult('MissingNullHandler', flow.missingNullHandlers));
    }
    if (options.unconnectedElements) {
      flow.unconnectedElements = new UnconnectedElements().execute(flow);
      flow.scanResults.push(new ScanResult('UnconnectedElements', flow.unconnectedElements));
    }
    if (options.unusedVariables) {
      flow.unusedVariables = new UnusedVariables().execute(flow);
      flow.scanResults.push(new ScanResult('UnusedVariables', flow.unusedVariables));
    }
  }
  return flows;
}
