export type AdvancedConfig = {
  disabled?: boolean;
  expression?: {
    [key: string]: number | string;
  };
  path?: string;
  severity?: string;
  suppressions?: string[];
};

export type AdvancedRuleConfig = {
  [ruleName: string]: AdvancedConfig;
};
