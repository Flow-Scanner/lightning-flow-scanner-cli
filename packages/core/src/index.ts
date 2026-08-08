// Updated exports in index.ts
import type { IRuleDefinition } from "./main/interfaces/IRuleDefinition";
import type { ConfigurableOption } from "./main/models/RuleInfo";
import type { IRulesConfig, RuleCategory, Severity, Threshold } from "./main/interfaces/IRulesConfig";
import { SEVERITY_ORDER, meetsThreshold, countThresholdViolations, filterByThreshold } from "./main/interfaces/IRulesConfig";
import type { FlatViolation } from "./main/models/FlatViolation";
import { Compiler } from "./main/libs/Compiler";
import { exportDetails } from "./main/libs/ExportDetails";
import { exportSarif } from "./main/libs/ExportSarif";
import { fix } from "./main/libs/FixFlows";
import { getRules } from "./main/libs/GetRuleDefinitions";
import { parse } from "./main/libs/ParseFlows";
import { scan } from "./main/libs/ScanFlows";
import { Flow } from "./main/models/Flow";
import { FlowAttribute } from "./main/models/FlowAttribute";
import { FlowElement } from "./main/models/FlowElement";
import { FlowNode } from "./main/models/FlowNode";
import { FlowResource } from "./main/models/FlowResource";
import { FlowType } from "./main/models/FlowType";
import { FlowVariable } from "./main/models/FlowVariable";
import { ParsedFlow } from "./main/models/ParsedFlow";
import { RuleResult } from "./main/models/RuleResult";
import { ScanResult } from "./main/models/ScanResult";
import { Violation } from "./main/models/Violation";
import { DEFAULT_ICONS, ASCII_ICONS, type NodeIconConfig } from "./main/config/NodeIcons";
import { DEFAULT_VARIABLE_ICONS, ASCII_VARIABLE_ICONS, type VariableIconConfig } from "./main/config/VariableIcons";
import { exportDiagram, type DiagramOptions } from "./main/libs/ExportDiagram";
import {
  NoOpResolver,
  PreloadedResolver,
  defaultResolver,
  type SubflowResolver,
  type SubflowResolutionContext,
  type ResolvedSubflow,
} from "./main/libs/SubflowResolver";

export {
  Compiler,
  NoOpResolver,
  PreloadedResolver,
  defaultResolver,
  exportDetails,
  exportDiagram,
  exportSarif,
  fix,
  Flow,
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowResource,
  FlowType,
  FlowVariable,
  getRules,
  parse,
  ParsedFlow,
  Violation,
  RuleResult,
  scan,
  ScanResult,
  DEFAULT_ICONS,
  ASCII_ICONS,
  DEFAULT_VARIABLE_ICONS,
  ASCII_VARIABLE_ICONS,
  // Threshold utilities
  SEVERITY_ORDER,
  meetsThreshold,
  countThresholdViolations,
  filterByThreshold,
};
export type { ConfigurableOption, FlatViolation, IRuleDefinition, IRulesConfig, RuleCategory, Severity, Threshold, NodeIconConfig, DiagramOptions, VariableIconConfig, SubflowResolver, SubflowResolutionContext, ResolvedSubflow };