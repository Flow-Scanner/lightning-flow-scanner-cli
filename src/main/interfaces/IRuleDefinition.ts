import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';

export interface IRuleDefinition {
  uri: string;
  name: string;
  label: string;
  text: string;
  supportedTypes: string[];

  execute(flow: Flow): RuleResult;
}
