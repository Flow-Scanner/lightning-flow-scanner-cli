# Lightning Flow Scanner(Core)
### _Used in both the VSCode extension as well as SFDX plugin with the same name._

## Rules Included:

      DML statements in a loop,
      Duplicate DML operations,
      Hardcoded Ids,
      Missing flow description,
      Missing error handlers,
      Missing null handlers,
      Unconnected elements(auto-fix),
      Unused variables(auto-fix)

## Functions

`GetRules(ruleNames? : string[]): IRuleDefinition[];`

Returns all rules if there are no ruleNames specified. In case ruleNames are specified, it will only return rules which are included by name. 

`Scan(flows: Flow[], ruleOptions?: ScannerOptions): ScanResult[];`

If there are no ruleNames specified, it will run all available rules by default. In case that there are ruleNames specified, only the  specified rules will be ran.

`Fix(flows :Flow[]): ScanResult[];`

Remove unused variables and unconnected elements from selected flows automatically.

