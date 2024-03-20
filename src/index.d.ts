// index.d.ts
import IRuleDefinition from "./main/interfaces/IRuleDefinition";
import { IRulesConfig } from "./main/interfaces/IRulesConfig";
import Compiler from "./main/libs/Compiler";
import Flow from "./main/models/Flow";
import FlowAttribute from "./main/models/FlowAttribute";
import FlowElement from "./main/models/FlowElement";
import FlowType from "./main/models/FlowType";
import FlowNode from "./main/models/FlowNode";
import FlowVariable from "./main/models/FlowVariable";
import ResultDetails from "./main/models/ResultDetails";
import RuleResult from "./main/models/RuleResult";
import ScanResult from "./main/models/ScanResult";

// Export functions
export declare function getRules(ruleNames?: string[]): IRuleDefinition[];
export declare function scan(flows: Flow[], ruleOptions?: IRulesConfig): ScanResult[];
export declare function fix(flows: Flow[]): ScanResult[];

// Export models and interfaces
export {
  Flow,
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowType,
  FlowVariable,
  Compiler,
  ScanResult,
  RuleResult,
  ResultDetails,
  IRuleDefinition,
  IRulesConfig // Export additional interfaces or types if needed
};
