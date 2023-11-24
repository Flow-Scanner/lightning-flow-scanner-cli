# Lightning Flow Scanner(Rule Set)

##### _This core rule set is used in both the [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightningflowscanner&ssr=false#review-details) and the [SFDX Plugin](https://www.npmjs.com/package/lightning-flow-scanner) of the same name._

## Rules

- [Outdated API Version](#outdated-api-version)
- [Copy API Name](#copy-api-name)
- [DML Statement In A Loop'](#dml-statement-in-a-loop)
- [Duplicate DML Operation](#duplicate-dml-operation)
- [Missing Flow Description](#missing-flow-description)
- [Flow Naming Convention](#flow-naming-convention)
- [Hardcoded Id](#hardcoded-id)
- [Missing Fault Path](#missing-fault-path)
- [Missing Null Handler](#missing-null-handler)
- [SOQL Query In A Loop](#soql-query-in-a-loop)
- [Unconnected Element](#unconnected-element)
- [Unused Variable](#unused-variable) 

___

### Outdated API Version

Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.

_Default Value: `>49.0`_

_Configuration example:_
```
APIVersion:
    {
        severity: 'error',
        expression: '===58'
    }
```

**Configuration ID: `APIVersion`**
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/APIVersion.ts))_

___

### Copy API Name

Maintaining multiple elements with a similar name, like 'Copy_X_Of_Element,' can diminish the overall readability of your Flow. When copying and pasting these elements, it's crucial to remember to update the API name of the newly created copy.

**Configuration ID: `CopyAPIName`**
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/CopyAPIName.ts))_

___

### DML Statement In A Loop

To prevent exceeding Apex governor limits, it is advisable to consolidate all your database operations, including record creation, updates, or deletions, at the conclusion of the flow.

**Configuration ID: `DMLStatementInLoop`**
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/DMLStatementInLoop.ts))_

___

### Duplicate DML Operation

When the flow executes database changes or actions between two screens, it's important to prevent users from navigating back between screens. Failure to do so may result in duplicate database operations being performed within the flow.

**Configuration ID: `DuplicateDMLOperation`**
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/DuplicateDMLOperation.ts))_

___

### Missing Flow Description

Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.

**Configuration ID: `FlowDescription`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/FlowDescription.ts))_

___

### Flow Naming Convention

The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'.

_Default Value: `[A-Za-z0-9]+_[A-Za-z0-9]+`_

_Configuration example:_
```
FlowName:
    {
        severity: 'error',
        expression: '[A-Za-z0-9]'
    }
```

**Configuration ID: `FlowName`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/FlowName.ts))_

___

### Hardcoded Id

Avoid hard-coding IDs as they are org-specific. Instead, pass them into variables at the start of the flow. You can achieve this by utilizing merge fields in URL parameters or employing a Get Records element.

**Configuration ID: `HardcodedId`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/HardcodedId.ts))_

___

### Missing Fault Path

At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path.

**Configuration ID: `MissingFaultPath`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/MissingFaultPath.ts))_

___

### Missing Null Handler

When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result.

**Configuration ID: `MissingNullHandler`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/MissingNullHandler.ts))_

___

### SOQL Query In A Loop

To prevent exceeding Apex governor limits, it is advisable to consolidate all your SOQL queries at the conclusion of the flow.

**Configuration ID: `SOQLQueryInLoop`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/SOQLQueryInLoop.ts))_

___

### Unconnected Element

To maintain the efficiency and manageability of your Flow, it's best to avoid including unconnected elements that are not in use.

**Configuration ID: `UnconnectedElement`**
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/UnconnectedElement.ts))_

___

### Unused Variable

To maintain the efficiency and manageability of your Flow, it's advisable to avoid including unconnected variables that are not in use. 

**Configuration ID: `UnusedVariable`** 
_([View source code](https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/UnusedVariable.ts))_
