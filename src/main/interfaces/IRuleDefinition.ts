import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';

export interface IRuleDefinition {
  uri: string;
  name: string;
  label: string;
  text: string;

  execute(flow: Flow): RuleResult;
}
