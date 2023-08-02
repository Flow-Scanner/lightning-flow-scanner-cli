import { APIVersion } from '../rules/APIVersion';
import { CopyOf } from '../rules/CopyOf';
import { DMLStatementInLoop } from '../rules/DMLStatementInLoop';
import { DuplicateDMLOperations } from '../rules/DuplicateDMLOperations';
import { FlowDescription } from '../rules/FlowDescription';
import { FlowName } from '../rules/FlowName';
import { HardcodedIds } from '../rules/HardcodedIds';
import { MissingFaultPath } from '../rules/MissingFaultPath';
import { MissingNullHandler } from '../rules/MissingNullHandler';
import { UnconnectedElements } from '../rules/UnconnectedElements';
import { UnusedVariables } from '../rules/UnusedVariables';

export const DefaultRuleStore: {} = {
  APIVersion,
  CopyOf,
  DMLStatementInLoop,
  DuplicateDMLOperations,
  FlowDescription,
  FlowName,
  HardcodedIds,
  MissingFaultPath,
  MissingNullHandler,
  UnconnectedElements,
  UnusedVariables
};