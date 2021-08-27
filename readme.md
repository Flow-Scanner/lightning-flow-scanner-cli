# Lightning Flow Scanner(Core)
### _Used in both the VSCode extension as well as SFDX plugin with the same name._


## Rules(Currently included):

      "DML statements in a loop",
      "Duplicate DML operations",
      "Hardcoded Ids",
      "Missing flow description",
      "Missing error handlers",
      "Missing null handlers",
      "Unconnected elements",
      "Unused variables"

## Available Functions

`getRuleDefinitions(ruleNames? : string[]): IRuleDefinition[];`

Returns all rules if there are no ruleNames specified. In case ruleNames are specified, it will only return rules which are included by name. 

`scan(flows :Flow[], ruleNames? : string[]): ScanResult[];`

Runs all rules if there are no ruleNames specified. In case ruleNames are specified, it will only run rules which are included by name. 

`fix(flows :Flow[]): ScanResult[];`

Removes unused variables and unconnected elements from all selected flows.

