import {DMLStatementInLoop} from '../rules/DMLStatementInLoop';
import {DuplicateDMLOperations} from '../rules/DuplicateDMLOperations';
import {HardcodedIds} from '../rules/HardcodedIds';
import {FlowName} from '../rules/FlowName';
import {MissingFaultPath} from '../rules/MissingFaultPath';
import {MissingFlowDescription} from '../rules/MissingFlowDescription';
import {MissingNullHandler} from '../rules/MissingNullHandler';
import {UnconnectedElements} from '../rules/UnconnectedElements';
import {UnusedVariables} from '../rules/UnusedVariables';

export const rulestore: {} = {
  DMLStatementInLoop,
  DuplicateDMLOperations,
  HardcodedIds,
  FlowName,
  MissingFaultPath,
  MissingFlowDescription,
  MissingNullHandler,
  UnconnectedElements,
  UnusedVariables
};
