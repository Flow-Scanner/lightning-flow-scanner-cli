import { Flow, RuleResult } from "../internals/internals";
import { ConfigurableOption } from "../models/RuleInfo";

export interface IRuleDefinition {
  ruleId: string;
  category?: 'problem' | 'suggestion' | 'layout' | 'system';
  description: string;
  summary: string; // Short summary (5-10 words) shown when no custom message
  docRefs: Array<{ label: string; path: string }>;
  execute(flow: Flow, options?: object, suppressions?: string[]): RuleResult;
  isConfigurable: boolean;
  configurableOptions?: ConfigurableOption[];
  isFixable: boolean;
  label: string;
  name: string;
  severity?: string;
  supportedTypes: string[];
  uri?: string;
}