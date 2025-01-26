import {
  Flow,
  ParsedFlow,
  ResultDetails,
  RuleResult,
  ScanResult,
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowResource,
  FlowType,
  FlowVariable,
} from "./main/models";
import { Compiler } from "./main/libs";
import type { IRuleDefinition, IRulesConfig } from "./main/interfaces";
declare function getRules(ruleNames?: string[]): IRuleDefinition[];
declare function parse(selectedUris: string[]): Promise<ParsedFlow[]>;
declare function scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[];
declare function fix(results: ScanResult[]): ScanResult[];
export {
  Flow,
  ParsedFlow,
  ResultDetails,
  RuleResult,
  ScanResult,
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowResource,
  FlowType,
  FlowVariable,
  Compiler,
  getRules,
  parse,
  scan,
  fix,
};
export type { IRuleDefinition };
