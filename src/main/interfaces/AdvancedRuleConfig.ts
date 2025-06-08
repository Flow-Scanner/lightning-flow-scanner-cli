export type AdvancedConfig = {
  disabled?: boolean;
  path?: string;
  severity?: string;
  suppressions?: string[];
};

export type AdvancedRuleConfig = {
  [ruleName: string]: AdvancedConfig;
};
