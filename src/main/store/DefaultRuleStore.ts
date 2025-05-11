import { APIVersion } from "../rules/APIVersion";
import { AutoLayout } from "../rules/AutoLayout";
import { CopyAPIName } from "../rules/CopyAPIName";
import { CyclomaticComplexity } from "../rules/CyclomaticComplexity";
import { DMLStatementInLoop } from "../rules/DMLStatementInLoop";
import { DuplicateDMLOperation } from "../rules/DuplicateDMLOperation";
import { FlowDescription } from "../rules/FlowDescription";
import { FlowName } from "../rules/FlowName";
import { HardcodedId } from "../rules/HardcodedId";
import { InactiveFlow } from "../rules/InactiveFlow";
import { MissingFaultPath } from "../rules/MissingFaultPath";
import { MissingNullHandler } from "../rules/MissingNullHandler";
import { ProcessBuilder } from "../rules/ProcessBuilder";
import { SOQLQueryInLoop } from "../rules/SOQLQueryInLoop";
import { UnconnectedElement } from "../rules/UnconnectedElement";
import { UnsafeRunningContext } from "../rules/UnsafeRunningContext";
import { UnusedVariable } from "../rules/UnusedVariable";
import { SameRecordFieldUpdates } from "../rules/SameRecordFieldUpdates";
import { TriggerOrder } from "../rules/TriggerOrder";
import { GetRecordAllFields } from "../rules/GetRecordAllFields";
import { HardcodedUrl } from "../rules/HardcodedUrl";
import { RecursiveAfterUpdate } from "../rules/RecursiveAfterUpdate";

export const DefaultRuleStore: object = {
  APIVersion,
  AutoLayout,
  CopyAPIName,
  CyclomaticComplexity,
  DMLStatementInLoop,
  DuplicateDMLOperation,
  FlowDescription,
  FlowName,
  HardcodedId,
  InactiveFlow,
  MissingFaultPath,
  MissingNullHandler,
  ProcessBuilder,
  RecursiveAfterUpdate,
  SameRecordFieldUpdates,
  SOQLQueryInLoop,
  TriggerOrder,
  UnconnectedElement,
  UnsafeRunningContext,
  UnusedVariable,
};

export const BetaRuleStore: object = {
  GetRecordAllFields,
  HardcodedUrl,
};
