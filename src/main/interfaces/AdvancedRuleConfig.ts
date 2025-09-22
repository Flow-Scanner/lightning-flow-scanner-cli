export type AdvancedConfig = {
  disabled?: boolean;
  expression?: {
    [key: string]: number | string;
  };
  severity?: string;
  suppressions?: string[];
};

export type AdvancedRuleConfig = {
  [ruleName: string]: AdvancedConfig;
};
