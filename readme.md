# Lightning Flow Scanner

_An Extensible Rule Engine for Salesforce Flows used by the Lightning Flow Scanner [Salesforce CLI Plugin](https://www.npmjs.com/package/lightning-flow-scanner) and [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner&ssr=false#review-details)._ 

- [Default Rules](#default-rules)
- [Configurations](#configurations)
  - [Rule Configuration](#rule-configuration)
  - [Custom Rule Interface](#custom-rule-interface)
  - [Exception Configuration](#exception-configuration)
- [Development Setup](#development-setup)

## Default Rules

| Rule (Configuration ID) | Description |
|--------------------------|-------------|
| **Auto Layout** ([`AutoLayout`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/AutoLayout.ts)) | With Canvas Mode set to Auto-Layout, Elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized thus saving you time. |
| **Outdated API Version** ([`APIVersion`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/APIVersion.ts)) | Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them. |
| **Copy API Name** ([`CopyAPIName`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/CopyAPIName.ts)) | Maintaining multiple elements with a similar name, like 'Copy_X_Of_Element,' can diminish the overall readability of your Flow. When copying and pasting these elements, it's crucial to remember to update the API name of the newly created copy. |
| **DML Statement In A Loop** ([`DMLStatementInLoop`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/DMLStatementInLoop.ts)) | To prevent exceeding Apex governor limits, it is advisable to consolidate all your database operations, including record creation, updates, or deletions, at the conclusion of the flow. |
| **Duplicate DML Operation** ([`DuplicateDMLOperation`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/DuplicateDMLOperation.ts)) | When the flow executes database changes or actions between two screens, it's important to prevent users from navigating back between screens. Failure to do so may result in duplicate database operations being performed within the flow. |
| **Flow Naming Convention** ([`FlowName`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/FlowName.ts)) | The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'. |
| **Hardcoded Id** ([`HardcodedId`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/HardcodedId.ts)) | Avoid hard-coding IDs as they are org-specific. Instead, pass them into variables at the start of the flow. You can achieve this by utilizing merge fields in URL parameters or employing a Get Records element. |
| **Inactive Flow** ([`InactiveFlow`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/InactiveFlow.ts)) | Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble, like accidentally deleting records during testing, or being activated as subflows within parent flows. |
| **Missing Flow Description** ([`FlowDescription`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/FlowDescription.ts)) | Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose. |
| **Missing Fault Path** ([`MissingFaultPath`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/MissingFaultPath.ts)) | At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path. |
| **Missing Null Handler** ([`MissingNullHandler`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/MissingNullHandler.ts)) | When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result. |
| **Process Builder** ([`ProcessBuilder`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/ProcessBuilder.ts)) | Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Ensure you're prepared for this transition by migrating your organization's automation to Flow. Refer to official documentation for more information on the transition process and tools available. |
| **SOQL Query In A Loop** ([`SOQLQueryInLoop`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/SOQLQueryInLoop.ts)) | To prevent exceeding Apex governor limits, it is advisable to consolidate all your SOQL queries at the conclusion of the flow. |
| **Unconnected Element** ([`UnconnectedElement`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/UnconnectedElement.ts)) | Unconnected elements which are not being used by the Flow should be avoided to keep Flows efficient and maintainable. |
| **Unused Variable** ([`UnusedVariable`](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/UnusedVariable.ts)) | To maintain the efficiency and manageability of your Flow, it's advisable to avoid including unconnected variables that are not in use. |

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

- **Severity:**
  - Optional values for severity are "error", "warning", and "note".
  - If severity is provided, it overwrites the default severity, which is "error".

- **Expression:**
  - Expression is used to overwrite standard values in configurable rules.

- **Path:**
  - If a path is provided, it can either replace an existing rule with a new rule definition or load a custom rule.
  - Ensure that the rule name used in the path matches the  exported class name of the rule.

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

1. **Clone Repository**: Begin by cloning the Lightning Flow Scanner Core repository to your local machine:

    ```bash
    git clone https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core.git
    ```

2. **Install Dependencies**: Navigate into the cloned repository directory and install the necessary dependencies using Yarn:

    ```bash
    cd lightning-flow-scanner-core
    yarn install
    ```

3. **Build**: Compile the TypeScript source files into JavaScript using the TypeScript compiler:

    ```bash
    yarn build
    ```

    This command generates the compiled JavaScript files in the `out` directory.

4. **Run Tests**: Ensure the module functions correctly by running the test suites:

    ```bash
    yarn test
    ```

    This command uses Mocha to run tests located in the `tests` directory and provides feedback on the module's functionality.

5. **Debugging in IDE**: If needed, set up your integrated development environment (IDE) for debugging TypeScript code. Configure breakpoints, inspect variables, and step through the code to identify and resolve issues efficiently.
