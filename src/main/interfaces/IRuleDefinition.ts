import { Flow } from "../models/Flow";
import { RuleResult } from "../models/RuleResult";

export interface IRuleDefinition {
  autoFixable: boolean;
  description: string;
  docRefs: Array<{ label: string; path: string }>;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  execute(flow: Flow, ruleOptions?: {}): RuleResult;
  isConfigurable: boolean;
  label: string;
  name: string;
  severity?: string;
  supportedTypes: string[];

  uri?: string;
}
