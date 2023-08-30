import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';

export interface IRuleDefinition {
  uri: string;
  name: string;
  label: string;
  description: string;
  supportedTypes: string[];
  type: string;
  docRefs:  {label: string, path: string}[];
  severity?: string;

  execute(flow: Flow, ruleOptions? : {}): RuleResult;
}