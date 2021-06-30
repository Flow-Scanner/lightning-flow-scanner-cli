import {Flow} from '../models/Flow';
import {ScanResult} from '../models/ScanResult';
import {ScanOptions} from '../models/ScanOptions';
import {RuleResult} from '../models/RuleResult';
import {DMLStatementInLoop} from '../rules/DMLStatementInLoop';
import {DuplicateDMLOperationsByNavigation} from '../rules/DuplicateDMLOperationsByNavigation';
import {HardcodedIds} from '../rules/HardcodedIds';
import {MissingFaultPath} from '../rules/MissingFaultPath';
import {MissingFlowDescription} from '../rules/MissingFlowDescription';
import {MissingNullHandler} from '../rules/MissingNullHandler';
import {UnconnectedElements} from '../rules/UnconnectedElements';
import {UnusedVariables} from '../rules/UnusedVariables';

export function ScanFlows(flows: Flow[], options: ScanOptions) : ScanResult[] {

  const flowResults : ScanResult[] = [];
  for (const flow of flows) {

    const scanResults: RuleResult[] = [];
    if (options.dmlStatementInLoop) {
      scanResults.push(new DMLStatementInLoop().execute(flow));
    }
    if (options.duplicateDMLOperations) {
      scanResults.push(new DuplicateDMLOperationsByNavigation().execute(flow));
    }
    if (options.hardcodedIds) {
      scanResults.push(new HardcodedIds().execute(flow));
    }
    if (options.missingDescription) {
      scanResults.push(new MissingFlowDescription().execute(flow));
    }
    if (options.missingFaultPaths) {
      scanResults.push(new MissingFaultPath().execute(flow));
    }
    if (options.missingNullHandlers) {
      scanResults.push(new MissingNullHandler().execute(flow));
    }
    if (options.unconnectedElements) {
      scanResults.push(new UnconnectedElements().execute(flow));
    }
    if (options.unusedVariables) {
      scanResults.push(new UnusedVariables().execute(flow));
    }
    flowResults.push(new ScanResult(flow, scanResults));
  }
  return flowResults;
}
