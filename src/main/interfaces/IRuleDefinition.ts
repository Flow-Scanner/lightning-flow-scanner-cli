import { Flow } from "../models/Flow";
import { RuleResult } from "../models/RuleResult";

export default interface IRuleDefinition {
  name: string;
  label: string;
  description: string;
  supportedTypes: string[];
  docRefs: { label: string; path: string }[];
  isConfigurable: boolean;
  autoFixable: boolean;
  uri?: string;
  severity?: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  execute(flow: Flow, ruleOptions?: {}): RuleResult;
}
