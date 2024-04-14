import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';

export interface IRuleDefinition {
  name: string;
  label: string;
  description: string;
  supportedTypes: string[];
  docRefs: { label: string, path: string }[];
  isConfigurable: boolean;
  autoFixable: boolean;
  uri?: string;
  severity?: string;

  execute(flow: Flow, ruleOptions?: {}): RuleResult;
}