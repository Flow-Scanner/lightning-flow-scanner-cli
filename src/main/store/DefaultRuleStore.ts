import { APIVersion } from '../rules/APIVersion';
import { AutoLayout } from '../rules/AutoLayout';
import { CopyAPIName } from '../rules/CopyAPIName';
import { DMLStatementInLoop } from '../rules/DMLStatementInLoop';
import { DuplicateDMLOperation } from '../rules/DuplicateDMLOperation';
import { FlowDescription } from '../rules/FlowDescription';
import { FlowName } from '../rules/FlowName';
import { HardcodedId } from '../rules/HardcodedId';
import { MissingFaultPath } from '../rules/MissingFaultPath';
import { MissingNullHandler } from '../rules/MissingNullHandler';
import { SOQLQueryInLoop } from '../rules/SOQLQueryInLoop';
import { UnconnectedElement } from '../rules/UnconnectedElement';
import { UnusedVariable } from '../rules/UnusedVariable';

export const DefaultRuleStore: {} = {
  APIVersion,
  AutoLayout,
  CopyAPIName,
  DMLStatementInLoop,
  DuplicateDMLOperation,
  FlowDescription,
  FlowName,
  HardcodedId,
  MissingFaultPath,
  MissingNullHandler,
  SOQLQueryInLoop,
  UnconnectedElement,
  UnusedVariable
};