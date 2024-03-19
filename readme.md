# Lightning Flow Scanner Core

_An Extensible Rule Engine for Salesforce Flows used by the Lightning Flow Scanner [Salesforce CLI Plugin](https://www.npmjs.com/package/lightning-flow-scanner) and [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner&ssr=false#review-details)._ 

- [Default Ruleset](#default-ruleset)
- [Configurations](#configurations)
  - [Rule Configuration](#rule-configuration)
  - [Custom Rule Interface](#custom-rule-interface)
  - [Exception Configuration](#exception-configuration)
- [Development Setup](#development-setup)

## Default Ruleset

The default ruleset consists of the following rules:

- Outdated API Version (configurable)
- Copy API Name
- DML Statement In A Loop
- Duplicate DML Operation
- Missing Flow Description
- Flow Naming Convention (configurable)
- Hardcoded Id
- Missing Fault Path
- Missing Null Handler
- SOQL Query In A Loop
- Unconnected Element
- Unused Variable 

For more details on the ruleset and its configurability see  _[Default Rule Definitions](https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/docs/defaultrules.md)_

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