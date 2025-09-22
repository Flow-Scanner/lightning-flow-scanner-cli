[![Lightning Flow Scanner Banner](https://raw.githubusercontent.com/Flow-Scanner/lightning-flow-scanner-core/main/media/bannerslim.png)](https://github.com/Flow-Scanner)

- [Default Rules](#default-rules)
- [Core Functions](#core-functions)
- [Configurations](#configurations)
  - [Rule Configuration](#rule-configuration)
  - [Exception Configuration](#exception-configuration)
- [Development Setup](#development-setup)

---

## Default Rules

📌 **Tip:** To link directly to a specific rule, use the full GitHub anchor link format:
`https://github.com/Flow-Scanner/lightning-flow-scanner-core?tab=readme-ov-file#<rule-label`

Example:
_https://github.com/Flow-Scanner/lightning-flow-scanner-core?tab=readme-ov-file#unsafe-running-context_

---

### Action Calls In Loop

_[ActionCallsInLoop](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/ActionCallsInLoop.ts)_ - To prevent exceeding Apex governor limits, it is advisable to consolidate and bulkify your apex calls, utilizing a single action call containing a collection variable at the end of the loop.

### Outdated API Version

_[APIVersion](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/APIVersion.ts)_ - Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the **Api Version** attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.

### Auto Layout

_[AutoLayout](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/AutoLayout.ts)_ - With Canvas Mode set to Auto‑Layout, elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized—saving you time.

### Copy API Name

_[CopyAPIName](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/CopyAPIName.ts)_ - Maintaining multiple elements with a similar name, like `Copy_X_Of_Element`, can diminish the overall readability of your Flow. When copying and pasting these elements, remember to update the API name of the newly created copy.

### Cyclomatic Complexity

_[CyclomaticComplexity](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/CyclomaticComplexity.ts)_ - The number of loops and decision rules, plus the number of decisions. Use a combination of 1) subflows and 2) breaking flows into multiple concise trigger‑ordered flows to reduce cyclomatic complexity within a single flow, ensuring maintainability and simplicity.

### DML Statement In A Loop

_[DMLStatementInLoop](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/DMLStatementInLoop.ts)_ - To prevent exceeding Apex governor limits, consolidate all your database operations—record creation, updates, or deletions—at the conclusion of the flow.

### Duplicate DML Operation

_[DuplicateDMLOperation](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/DuplicateDMLOperation.ts)_ - When a flow executes database changes or actions between two screens, prevent users from navigating backward between screens; otherwise, duplicate database operations may be performed.

### Flow Naming Convention

_[FlowName](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/FlowName.ts)_ - The readability of a flow is paramount. Establishing a naming convention significantly enhances findability, searchability, and overall consistency. Include at least a domain and a brief description of the flow’s actions, for example `Service_OrderFulfillment`.

### Get Record All Fields

_[GetRecordAllFields](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/GetRecordAllFields.ts)_ - Following the principle of least privilege (PoLP), avoid using **Get Records** with “Automatically store all fields” unless necessary.

### Hardcoded Id

_[HardcodedId](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/HardcodedId.ts)_ - Avoid hard‑coding IDs because they are org specific. Instead, pass them into variables at the start of the flow—via merge‑field URL parameters or a **Get Records** element.

### Hardcoded Url

_[HardcodedUrl](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/HardcodedUrl.ts)_ - Avoid hard‑coding URLs because they are environment specific. Use an `$API` formula (preferred) or environment‑specific sources like custom labels, metadata, or settings.

### Inactive Flow

_[InactiveFlow](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/InactiveFlow.ts)_ - Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble—such as accidentally deleting records during testing, or being activated as subflows.

### Missing Fault Path

_[MissingFaultPath](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/MissingFaultPath.ts)_ - A flow may fail to execute an operation as intended. By default, the flow displays an error to the user and emails the creator. Customize this behavior by incorporating a Fault Path.

### Missing Flow Description

_[FlowDescription](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/FlowDescription.ts)_ - Descriptions play a vital role in documentation. We highly recommend including details about where flows are used and their intended purpose.

### Missing Null Handler

_[MissingNullHandler](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/MissingNullHandler.ts)_ - When a **Get Records** operation finds no data, it returns `null`. Validate data by using a Decision element to check for a non‑null result.

### Process Builder

_[ProcessBuilder](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/ProcessBuilder.ts)_ - Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Begin migrating your organization’s automation to Flow.

### Recursive After Update

_[RecursiveAfterUpdate](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/RecursiveAfterUpdate.ts)_ - After‑update flows are meant for modifying **other** records. Using them on the same record can cause recursion. Consider **before‑save** flows for same‑record updates.

### Same Record Field Updates

_[SameRecordFieldUpdates](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/SameRecordFieldUpdates.ts)_ - Similar to triggers, **before‑save** contexts can update the same record via `$Record` without invoking DML.

### SOQL Query In A Loop

_[SOQLQueryInLoop](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/SOQLQueryInLoop.ts)_ - To prevent exceeding Apex governor limits, consolidate all SOQL queries at the end of the flow.

### Trigger Order

_[TriggerOrder](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/TriggerOrder.ts)_ - Guarantee your flow execution order with the **Trigger Order** property introduced in Spring ’22.

### Unconnected Element

_[UnconnectedElement](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/UnconnectedElement.ts)_ - Avoid unconnected elements that are not used by the flow to keep flows efficient and maintainable.

### Unsafe Running Context

_[UnsafeRunningContext](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/UnsafeRunningContext.ts)_ - This flow is configured to run in **System Mode without Sharing**, granting all users permission to view and edit all data. This can lead to unsafe data access.

### Unused Variable

_[UnusedVariable](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/UnusedVariable.ts)_ - To maintain efficiency and manageability, avoid including variables that are never referenced.

---

## Core Functions

### [`getRules(ruleNames?: string[]): IRuleDefinition[]`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/GetRuleDefinitions.ts)

_Retrieves rule definitions used in the scanner._

### [`parse(selectedUris: any): Promise<ParsedFlow[]>`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/ParseFlows.ts)

_Parses metadata from selected Flow files._

### [`scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[]`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/ScanFlows.ts)

_Runs rules against parsed flows and returns scan results._

### [`fix(results: ScanResult[]): ScanResult[]`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/FixFlows.ts)

_Attempts to apply automatic fixes where available._

---

## Configurations

### Rule Configuration

Using the rules section of your configurations, you can specify the list of rules to be run and provide custom rules. Furthermore, you can define the severity of violating specific rules and configure relevant attributes for some rules. Below is a breakdown of the available attributes of rule configuration:

```json
{
  "rules": {
    "<RuleName>": {
      "severity": "<Severity>",
      "expression": "<Expression>"
    }
  }
}
```

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

1. Clone the repo:

   ```bash
   git clone https://github.com/Flow-Scanner/lightning-flow-scanner-core.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Run tests:

   ```bash
   npm run test
   ```

5. (Optional) Deploy sample flows:

   ```bash
   npm run deploy:flows -- -o
   ```
