import { APIVersion } from '../rules/APIVersion';
import { DMLStatementInLoop } from '../rules/DMLStatementInLoop';
import { DuplicateDMLOperations } from '../rules/DuplicateDMLOperations';
import { HardcodedIds } from '../rules/HardcodedIds';
import { FlowName } from '../rules/FlowName';
import { MissingFaultPath } from '../rules/MissingFaultPath';
import { FlowDescription } from '../rules/FlowDescription';
import { MissingNullHandler } from '../rules/MissingNullHandler';
import { UnconnectedElements } from '../rules/UnconnectedElements';
import { UnusedVariables } from '../rules/UnusedVariables';

export const DefaultRuleStore: {} = {
  APIVersion,
  DMLStatementInLoop,
  DuplicateDMLOperations,
  HardcodedIds,
  FlowName,
  MissingFaultPath,
  FlowDescription,
  MissingNullHandler,
  UnconnectedElements,
  UnusedVariables
};