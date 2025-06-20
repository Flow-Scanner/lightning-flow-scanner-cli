[![Lightning Flow Scanner Banner](./media/bannerslim.png)](https://github.com/Lightning-Flow-Scanner)

_An Extensible Rule Engine capable of conducting static analysis on the metadata associated with Salesforce Lightning Flows, Process Builders, and Workflows. Used by the Lightning Flow Scanner [Salesforce CLI Plugin](https://www.npmjs.com/package/lightning-flow-scanner) and [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner&ssr=false#review-details)._

- [Default Rules](#default-rules)
- [Core Functions](#core-functions)
- [Configurations](#configurations)
  - [Rule Configuration](#rule-configuration)
  - [Custom Rule Interface](#custom-rule-interface)
  - [Exception Configuration](#exception-configuration)
- [Development Setup](#development-setup)

## Default Rules

| Rule (Configuration ID)                                                                                                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Auto Layout** ([`AutoLayout`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/AutoLayout.ts))                                       | With Canvas Mode set to Auto-Layout, Elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized thus saving you time.                                                                                                                                                                                                                                               |
| **Outdated API Version** ([`APIVersion`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/APIVersion.ts))                              | Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them. |
| **Copy API Name** ([`CopyAPIName`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/CopyAPIName.ts))                                   | Maintaining multiple elements with a similar name, like 'Copy_X_Of_Element,' can diminish the overall readability of your Flow. When copying and pasting these elements, it's crucial to remember to update the API name of the newly created copy.                                                                                                                                                    |
| **DML Statement In A Loop** ([`DMLStatementInLoop`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/DMLStatementInLoop.ts))           | To prevent exceeding Apex governor limits, it is advisable to consolidate all your database operations, including record creation, updates, or deletions, at the conclusion of the flow.                                                                                                                                                                                                               |
| **Duplicate DML Operation** ([`DuplicateDMLOperation`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/DuplicateDMLOperation.ts))     | When the flow executes database changes or actions between two screens, it's important to prevent users from navigating back between screens. Failure to do so may result in duplicate database operations being performed within the flow.                                                                                                                                                            |
| **Flow Naming Convention** ([`FlowName`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/FlowName.ts))                                | The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'.                                                     |
| **Hardcoded Id** ([`HardcodedId`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/HardcodedId.ts))                                    | Avoid hard-coding IDs as they are org-specific. Instead, pass them into variables at the start of the flow. You can achieve this by utilizing merge fields in URL parameters or employing a Get Records element.                                                                                                                                                                                       |
| **Inactive Flow** ([`InactiveFlow`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/InactiveFlow.ts))                                 | Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble, like accidentally deleting records during testing, or being activated as subflows within parent flows.                                                                                                                                                                                      |
| **Missing Flow Description** ([`FlowDescription`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/FlowDescription.ts))                | Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.                                                                                                                                                                                                                                                           |
| **Missing Fault Path** ([`MissingFaultPath`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/MissingFaultPath.ts))                    | At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path.                                                                                                                                     |
| **Missing Null Handler** ([`MissingNullHandler`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/MissingNullHandler.ts))              | When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result.                                                                                                                                                                                                            |
| **Process Builder** ([`ProcessBuilder`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/ProcessBuilder.ts))                           | Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Ensure you're prepared for this transition by migrating your organization's automation to Flow. Refer to official documentation for more information on the transition process and tools available.                                                                                                         |
| **SOQL Query In A Loop** ([`SOQLQueryInLoop`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/SOQLQueryInLoop.ts))                    | To prevent exceeding Apex governor limits, it is advisable to consolidate all your SOQL queries at the conclusion of the flow.                                                                                                                                                                                                                                                                         |
| **Unconnected Element** ([`UnconnectedElement`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/UnconnectedElement.ts))               | Unconnected elements which are not being used by the Flow should be avoided to keep Flows efficient and maintainable.                                                                                                                                                                                                                                                                                  |
| **Unused Variable** ([`UnusedVariable`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/UnusedVariable.ts))                           | To maintain the efficiency and manageability of your Flow, it's advisable to avoid including unconnected variables that are not in use.                                                                                                                                                                                                                                                                |
| **Unsafe Running Context** ([`UnsafeRunningContext`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/UnsafeRunningContext.ts))        | This flow is configured to run in System Mode without Sharing. This system context grants all running users the permission to view and edit all data in your org. Running a flow in System Mode without Sharing can lead to unsafe data access.                                                                                                                                                        |
| **Same Record Field Updates** ([`SameRecordFieldUpdates`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/SameRecordFieldUpdates.ts)) | Much like triggers, before contexts can update the same record by accessing the trigger variables `$Record` without needing to invoke a DML.                                                                                                                                                                                                                                                           |
| **Trigger Order** ([`TriggerOrder`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/TriggerOrder.ts))                                 | Guarantee your flow execution order with the Trigger Order property introduced in Spring '22                                                                                                                                                                                                                                                                                                           |
| **Cyclomatic Complexity** ([`CyclomaticComplexity`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/CyclomaticComplexity.ts))         | The number of loops and decision rules, plus the number of decisions. Use a combination of 1) subflows and 2) breaking flows into multiple concise trigger ordered flows, to reduce the cyclomatic complexity within a single flow, ensuring maintainability and simplicity.                                                                                                                           |
| **Recursive After Update** ([`RecursiveAfterUpdate`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/RecursiveAfterUpdate.ts))        | After updates are meant to be used for record modifications that are not the same record that triggered the flow. Using after updates on the same record can lead to recursion and unexpected behavior. Consider using before save flows for same record updates.                                                                                                                                      |
| **Get Record All Fields** ([`GetRecordAllFields`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/GetRecordAllFields.ts))             | Following the principle of least privilege (PoLP), avoid using Get Records with 'Automatically store all fields' unless necessary.                                                                                                                                                                                                                                                                     |
| **Hardcoded Url** ([`HardcodedUrl`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/HardcodedUrl.ts))                                 | Avoid hard-coding URLs as they are org-specific. Instead, use a $API formula (preferred) or you can use an environment-specific such as custom labels, custom metadata, or custom settings.                                                                                                                                                                                                            |
| **Action Calls In Loop** ([`ActionCallsInLoop`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/ActionCallsInLoop.ts))                | To prevent exceeding Apex governor limits, it is advisable to consolidate and bulkify your apex calls, utilize a single action call containing a collection variable at the end of the loop.                                                                                                                                                                                                           |

## Core Functions

The `index.ts` file in this repository contains the core functionality of the Lightning Flow Scanner Core. Below is an overview of the main functions exported from this file:

### `getRules(ruleNames?: string[]): IRuleDefinition[]`

This function retrieves the rule definitions used by the Lightning Flow Scanner. It takes an optional array of rule names as an argument and returns an array of `IRuleDefinition` objects representing the rules to be executed.

### `parse(selectedUris: any): Promise<ParsedFlow[]>`

The `parse` function parses the metadata of Salesforce Lightning Flows, Process Builders, and Workflows from the provided URIs. It returns a Promise that resolves to an array of `ParsedFlow` objects containing the parsed metadata.

### `scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[]`

The `scan` function conducts static analysis on the parsed metadata of Lightning Flows, Process Builders, and Workflows using the specified rules. It takes an array of `ParsedFlow` objects and an optional `IRulesConfig` object as arguments and returns an array of `ScanResult` objects representing the results of the analysis.

### `fix(results: ScanResult[]): ScanResult[]`

The `fix` function attempts to automatically fix certain issues identified during the static analysis. It takes an array of `ScanResult` objects as input and returns a modified array with any applicable fixes applied.

## Configurations

### Rule Configuration

Using the rules section of your configurations, you can specify the list of rules to be run and provide custom rules. Furthermore, you can define the severity of violating specific rules and configure relevant attributes for some rules. Below is a breakdown of the available attributes of rule configuration:

```json
{
  "rules": {
    "<RuleName>": {
      "severity": "<Severity>",
      "expression": "<Expression>",
      "path": "<Path>"
    }
  }
}
```

### \*\*Beta\*\* Advanced Rule Configuration

Advanced rules provide granular control by allowing rules to be intentionally disabled at the rule level, ensuring consistent application across all flows. Additionally, the concept of suppressions is introduced, enabling users to "whitelist" specific components. This mechanism allows for exceptions to be defined, offering flexibility in rule enforcement while maintaining overall governance and compliance.

JSON

```json
{
  "rules": {
    "<RuleName>": {
      "path": "local_path_of_your_js_file", // optional: when defined, this configuration will be used for the engine to recognize your custom rule
      "severity": "<User Configured Severity>",
      "expression": "<User Configured Expression which only applies to rules that take in `options`>",
      "disabled": "true", // optional: when true, rule will not be applied to all flows being scanned
      "suppressions": ["<User Configured Suppressions>"] // optional: when defined, takes an array of suppressed elements (not based on name but on specific type)
    }
  }
}
```

YAML

```yaml
rules:
  MissingFaultPath: # User Defined Rule configuration
    path: "local_path_of_your_js_file" # Optional: when defined, this configuration will be used for the engine to recognize your rule
    severity: error # Optional: User Defined severity, can be `info`, `warn`, `error`
    expression: ">=58" # Optional: User defined expression, only applies if rule is Configurable=true
    disabled: "true" # Optional: when true, rule will not be applied to all flows being scanned
    suppressions: # Optional: when defined, takes an array of elements to be suppressed, keys can be found on suppressionElements on the rule definition
      - LogACall # Optional: when defined, rule engine will look at suppressionElement defined on the rule to match against this list
```

- **Severity:**

  - Optional values for severity are "error", "warning", and "note".
  - If severity is provided, it overwrites the default severity, which is "error".

- **Expression:**

  - Expression is used to overwrite standard values in configurable rules.

- **Path:**

  - If a path is provided, it can either replace an existing rule with a new rule definition or load a custom rule.
  - Ensure that the rule name used in the path matches the exported class name of the rule.

### Custom Rule Interface

To create custom rules that can be loaded using the path attribute of the rule configurations, they need to adhere to the IRuleInterface. Please refer to the _[Custom Rule Creation Guide](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/docs/customruleguide.md)_ for detailed instructions.

### Exception Configuration

Specifying exceptions allows you to exclude specific scenarios from rule enforcement. Exceptions can be specified at the flow, rule, or result level to provide fine-grained control. Below is a breakdown of the available attributes of exception configuration:

```json
{
  "exceptions": {
    "<FlowName>": {
      "<RuleName>": [
        "<ResultName>",
        "<ResultName>",
        ...
      ]
    },
    ...
  }
}
```

- **FlowName:**

  - The name of the flow where exceptions apply.

- **RuleName:**

  - The name of the rule for which exceptions are defined.

- **ResultName:**

  - The specific result or condition within the rule for which exceptions are specified.

## Development Setup

Follow these steps to set up your development environment:

1. **Clone Repository:** Begin by cloning the Lightning Flow Scanner Core repository to your local machine:

```bash
git clone https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core.git
```

*(*Optional) Deploy Flows: test the rules against real flow metadata with a set of [example flows](./example-flows/force-app/main/default/flows) for demonstration purposes:\*

```
npm run deploy:flows -- -o
```

2. **Install Dependencies**: Navigate into the cloned repository directory and install the necessary dependencies using Yarn:

```bash
cd lightning-flow-scanner-core
npm install
```

4. **Build**: Compile the TypeScript source files into JavaScript using the TypeScript compiler:

   ```bash
   npm run build
   ```

   This command generates the compiled JavaScript files in the `out` directory.

5. **Run Tests**: Ensure the module functions correctly by running the test suites:

   ```bash
   npm run test
   ```

   This command uses Mocha to run tests located in the `tests` directory and provides feedback on the module's functionality.

6. ~~**Debugging in IDE**: If needed, set up your integrated development environment (IDE) for debugging TypeScript code. Configure breakpoints, inspect variables, and step through the code to identify and resolve issues efficiently.~~
