# Lightning Flow Scanner(Rule Engine)

##### _This the rule engine is used in both the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner&ssr=false#review-details) and the [SFDX plugin](https://www.npmjs.com/package/lightning-flow-scanner) of the same name._

## Rules

___

### Old API version

Newer API components may cause older versions of Flows to start behaving incorrectly due to differences in the underlying mechanics. The Api Version has been available as an attribute on the Flow since API v50.0 and it is recommended to limit variation and to update them on a regular basis.

Default Value: `>50.0`

Configuration example:
```
APIVersion:
    {
        severity: 'error',
        expression: '===58'
    }
```

Configuration ID: `APIVersion` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/APIVersion.ts))_

___

### DML statements in a loop

To avoid hitting Apex governor limits, we recommend grouping all of your changes together at the end of the flow, whether those changes create, update, or delete records.

Configuration ID: `DMLStatementInLoop` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/DMLStatementInLoop.ts))_

___

### Duplicate DML operations

If the flow commits changes to the database or performs actions between two screens, don't let users navigate back between screen. Otherwise, the flow may perform duplicate database operations.

Configuration ID: `DuplicateDMLOperations` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/DuplicateDMLOperations.ts))_

___

### Hardcoded Ids

IDs are org-specific, so don’t hard-code IDs. Instead, pass them into variables when the flow starts. You can do so, for example, by using merge fields in URL parameters or by using a Get Records element.

Configuration ID: `HardcodedIds` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/HardcodedIds.ts))_

___

### Flow naming conventions

Readability of a flow is very important. Setting a naming convention for the Flow Name will improve the findability/searchability and overall consistency. It is recommended to at least provide a domain and a short description of the actions undertaken in the flow, in example Service_OrderFulfillment.

Default Value: `[A-Za-z0-9]+_[A-Za-z0-9]+`

Configuration example:
```
FlowName:
    {
        severity: 'error',
        expression: '[A-Za-z0-9]'
    }
```

Configuration ID: `FlowName` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/FlowName.ts))_

___

### Missing flow description

Descriptions are useful for documentation purposes. It is recommended to provide information about where it is used and what it will do.

Configuration ID: `FlowDescription` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/FlowDescription.ts))_

___

### Missing error handlers

Sometimes a flow doesn’t perform an operation that you configured it to do. By default, the flow shows an error message to the user and emails the admin who created the flow. However, you can control that behavior.

Configuration ID: `MissingFaultPath` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/MissingFaultPath.ts))_

___

### Missing null handlers

If a Get Records operation does not find any data it will return null. Use a decision element on the operation result variable to validate that the result is not null.

Configuration ID: `MissingNullHandler` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/MissingNullHandler.ts))_

___

### Unconnected elements

Unconnected elements which are not being used by the Flow should be avoided to keep Flows efficient and maintainable. 

Configuration ID: `UnconnectedElements` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/UnconnectedElements.ts))_

___

### Unused variables

Unconnected variables which are not being used by the Flow should be avoided to keep Flow more efficient and maintainable.

Configuration ID: `UnusedVariables` _([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/UnusedVariables.ts))_
