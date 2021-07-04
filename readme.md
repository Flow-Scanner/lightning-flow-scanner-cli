getRules(ruleNames? : string[]): IRuleDefinition[];

Return all rules if no ruleNames are specified. 

scan(flows :Flow[], ruleNames? : string[]): ScanResult[];

Runs all rules if no ruleNames are specified. 

fix(flows :Flow[]): Flow[];

Removes unused variables and unconnected elements from flows
