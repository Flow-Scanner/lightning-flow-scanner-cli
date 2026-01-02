<p align="center">
  <a href="https://github.com/Flow-Scanner/lightning-flow-scanner/stargazers">
    <img src="https://img.shields.io/github/stars/Flow-Scanner/lightning-flow-scanner?label=Stargazers&style=flat-square" alt="GitHub stars">
  </a>
   <a href="https://www.npmjs.com/package/@flow-scanner/lightning-flow-scanner-core">
    <img src="https://img.shields.io/npm/v/@flow-scanner/lightning-flow-scanner-core?label=Core&style=flat-square" alt="Core version">
  </a>
  <a href="https://www.npmjs.com/package/lightning-flow-scanner">
    <img src="https://img.shields.io/npm/v/lightning-flow-scanner?label=CLI&style=flat-square" alt="CLI version">
  </a>
  <a href="https://open-vsx.org/extension/ForceConfigControl/lightning-flow-scanner-vsx">
    <img src="https://img.shields.io/open-vsx/v/ForceConfigControl/lightning-flow-scanner-vsx?label=VS%20Code&style=flat-square" alt="VS Code version">
  </a>
  <a href="https://www.npmjs.com/package/lightning-flow-scanner-core">
  <img src="https://img.shields.io/npm/dt/lightning-flow-scanner-core?label=Downloads%3Cv6&style=flat-square" alt="Downloads <v6">
</a>
<a href="https://www.npmjs.com/package/@flow-scanner/lightning-flow-scanner-core">
  <img src="https://img.shields.io/npm/dt/@flow-scanner/lightning-flow-scanner-core?label=Downloads%3Ev6&style=flat-square" alt="Downloads >v6">
</a>
</p>

<p align="center">
  <a href="https://github.com/Flow-Scanner">
    <img src="https://raw.githubusercontent.com/Flow-Scanner/Lightning-Flow-Scanner/main/docs/media/banner.png" alt="Lightning Flow Scanner" width="43%" />
  </a>
</p>

<p align="center"><i>Detect unsafe contexts, queries in loops, hardcoded IDs, and more to optimize Salesforce Flows</i></p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Flow-Scanner/Lightning-Flow-Scanner/main/docs/media/vsx.gif" alt="Flow Overview"/>
</p>

---

## Table of contents

- **[Usage](#usage)**
- **[Default Rules](#default-rules)**
- **[Configuration](#configuration)**
- **[Installation](#installation)**
- **[Development](#development)**

---

## Usage

Lightning Flow Scanner VSX is plug-and-play. Open any project with flows and use our side bar or the **Command Palette** and type `flow scanner` to see the list of all available commands.

* `Configure Scanner` - Set up rules in `.flow-scanner.yml`
* `Scan Flows` - Analyze a directory or selected flow files
* `Fix Flows` - Automatically apply available fixes
* `Generate Flow Documentation` - Generate flow documentation
* `Open Scanner Help` - Open the scanner and rule documentation

**Privacy:** Zero user data collected. All processing is client-side. → See our [Security Policy](https://github.com/Flow-Scanner/lightning-flow-scanner-vsx?tab=security-ov-file).

| Extension Settings           | Description                                                         | Default Value |
| ---------------------------- | ------------------------------------------------------------------- | ------------- |
| `flowscanner.SpecifyFiles` | Set to true to select .Flow file paths instead of a root directory. | `false`     |

## Default Rules

<p>📌<strong>Tip:</strong> To link directly to a specific rule, use the full GitHub anchor link format. Example:</p>
<p><em><a href="https://flow-scanner.github.io/lightning-flow-scanner/#unsafe-running-context">https://flow-scanner.github.io/lightning-flow-scanner/#unsafe-running-context</a></em></p>

> Want to code a new rule? → See [How to Write a Rule](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/docs/write-a-rule.md)

<!-- START GENERATED_RULES -->
### Action Call In A Loop
To prevent exceeding Apex governor limits, it is advisable to consolidate and bulkify your apex calls, utilizing a single action call containing a collection variable at the end of the loop.

**Rule ID:** `action-call-in-loop`
**Class Name:** _[ActionCallsInLoop](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/ActionCallsInLoop.ts)_
**Severity:** 🔴 *Error*

### DML Statement In A Loop
To prevent exceeding Apex governor limits, consolidate all your database operations—record creation, updates, or deletions—at the conclusion of the flow.

**Rule ID:** `dml-in-loop`
**Class Name:** _[DMLStatementInLoop](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/DMLStatementInLoop.ts)_
**Severity:** 🔴 *Error*

### Duplicate DML Operation
When a flow executes database changes or actions between two screens, prevent users from navigating backward between screens; otherwise, duplicate database operations may be performed.

**Rule ID:** `duplicate-dml`
**Class Name:** _[DuplicateDMLOperation](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/DuplicateDMLOperation.ts)_
**Severity:** 🟡 *Warning*

### Excessive Cyclomatic Complexity
The number of loops and decision rules, plus the number of decisions. Use a combination of 1) subflows and 2) breaking flows into multiple concise trigger ordered flows, to reduce the cyclomatic complexity within a single flow, ensuring maintainability and simplicity.

**Rule ID:** `excessive-cyclomatic-complexity`
**Class Name:** _[CyclomaticComplexity](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/CyclomaticComplexity.ts)_
**Severity:** 🔵 *Note*

### Flow Naming Convention
The readability of a flow is paramount. Establishing a naming convention significantly enhances findability, searchability, and overall consistency. Include at least a domain and a brief description of the flow’s actions, for example `Service_OrderFulfillment`.

**Rule ID:** `invalid-naming-convention`
**Class Name:** _[FlowName](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/FlowName.ts)_
**Severity:** 🔴 *Error*

### Get Record All Fields
Following the principle of least privilege (PoLP), avoid using **Get Records** with “Automatically store all fields” unless necessary.

**Rule ID:** `get-record-all-fields`
**Class Name:** _[GetRecordAllFields](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/GetRecordAllFields.ts)_
**Severity:** 🟡 *Warning*

### Hardcoded Id
Avoid hard-coding IDs because they are org specific. Instead, pass them into variables at the start of the flow—via merge-field URL parameters or a **Get Records** element.

**Rule ID:** `hardcoded-id`
**Class Name:** _[HardcodedId](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/HardcodedId.ts)_
**Severity:** 🔴 *Error*

### Hardcoded Url
Avoid hard-coding URLs because they are environment specific. Use an `$API` formula (preferred) or environment-specific sources like custom labels, metadata, or settings.

**Rule ID:** `hardcoded-url`
**Class Name:** _[HardcodedUrl](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/HardcodedUrl.ts)_
**Severity:** 🔴 *Error*

### Inactive Flow
Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble—such as accidentally deleting records during testing, or being activated as subflows.

**Rule ID:** `inactive-flow`
**Class Name:** _[InactiveFlow](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/InactiveFlow.ts)_
**Severity:** 🟡 *Warning*

### Invalid API Version
Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the **Api Version** attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.

**Rule ID:** `invalid-api-version`
**Class Name:** _[APIVersion](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/APIVersion.ts)_
**Severity:** 🟡 *Warning*

### Missing Auto Layout
With Canvas Mode set to Auto-Layout, elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized—saving you time.

**Rule ID:** `missing-auto-layout`
**Class Name:** _[AutoLayout](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/AutoLayout.ts)_
**Severity:** 🔵 *Note*

### Missing Fault Path
A flow may fail to execute an operation as intended. By default, the flow displays an error to the user and emails the creator. Customize this behavior by incorporating a Fault Path.

**Rule ID:** `missing-fault-path`
**Class Name:** _[MissingFaultPath](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/MissingFaultPath.ts)_
**Severity:** 🟡 *Warning*

### Missing Filter Record Trigger ![Beta](https://img.shields.io/badge/status-beta-yellow)
Record-triggered flows that lack filters on changed fields or entry conditions can lead to unnecessary executions on every record change. This may degrade system performance, hit governor limits faster, and increase resource consumption in high-volume orgs.

**Rule ID:** `missing-record-trigger-filter`
**Class Name:** _[MissingFilterRecordTrigger](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/MissingFilterRecordTrigger.ts)_
**Severity:** 🟡 *Warning*

### Missing Flow Description
Descriptions play a vital role in documentation. It is highly recommended to include details about where a flow is used and its intended purpose.

**Rule ID:** `missing-flow-description`
**Class Name:** _[FlowDescription](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/FlowDescription.ts)_
**Severity:** 🔴 *Error*

### Missing Metadata Description ![Beta](https://img.shields.io/badge/status-beta-yellow)
Flags Flow elements (Get Records, Assignments, Decisions, Actions, etc.) and metadata components (Variables, Formulas, Constants, Text Templates) that lack a description. Adding concise descriptions greatly improves readability, maintainability, and helps AI tools understand your automation intent.

**Rule ID:** `missing-metadata-description`
**Class Name:** _[MissingMetadataDescription](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/MissingMetadataDescription.ts)_
**Severity:** 🔴 *Error*

### Missing Null Handler
When a **Get Records** operation finds no data, it returns `null`. Validate data by using a Decision element to check for a non-null result.

**Rule ID:** `missing-null-handler`
**Class Name:** _[MissingNullHandler](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/MissingNullHandler.ts)_
**Severity:** 🟡 *Warning*

### Missing Trigger Order
Guarantee your flow execution order with the **Trigger Order** property introduced in Spring '22.value to their flows and guarantee their execution order. This priority value is not an absolute value, so the values need not be sequentially numbered as 1, 2, 3, and so on.

**Rule ID:** `unspecified-trigger-order`
**Class Name:** _[TriggerOrder](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/TriggerOrder.ts)_
**Severity:** 🔵 *Note*

### Process Builder
Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Begin migrating your organization’s automation to Flow.

**Rule ID:** `process-builder-usage`
**Class Name:** _[ProcessBuilder](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/ProcessBuilder.ts)_
**Severity:** 🟡 *Warning*

### Record ID as String ![Beta](https://img.shields.io/badge/status-beta-yellow)
Detects flows using a String variable named `recordId` as input when they could receive the entire record object instead. Since recent Salesforce releases, record pages and quick actions can pass the complete record, eliminating the need for an additional Get Records query and improving performance.

**Rule ID:** `record-id-as-string`
**Class Name:** _[RecordIdAsString](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/RecordIdAsString.ts)_
**Severity:** 🔴 *Error*

### Recursive After Update
After-update flows are meant for modifying **other** records. Using them on the same record can cause recursion. Consider **before-save** flows for same-record updates.

**Rule ID:** `recursive-record-update`
**Class Name:** _[RecursiveAfterUpdate](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/RecursiveAfterUpdate.ts)_
**Severity:** 🟡 *Warning*

### Same Record Field Updates
Similar to triggers, **before-save** contexts can update the same record via `$Record` without invoking DML.

**Rule ID:** `same-record-field-updates`
**Class Name:** _[SameRecordFieldUpdates](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/SameRecordFieldUpdates.ts)_
**Severity:** 🟡 *Warning*

### SOQL Query In A Loop
To prevent exceeding Apex governor limits, consolidate all SOQL queries at the end of the flow.

**Rule ID:** `soql-in-loop`
**Class Name:** _[SOQLQueryInLoop](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/SOQLQueryInLoop.ts)_
**Severity:** 🔴 *Error*

### Transform Instead of Loop ![Beta](https://img.shields.io/badge/status-beta-yellow)
Detects Loop elements that directly connect to Assignment elements. Transform elements handle collection manipulation in bulk operations, providing significant performance improvements over iterative loop-assignment patterns.

**Rule ID:** `transform-instead-of-loop`
**Class Name:** _[TransformInsteadOfLoop](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/TransformInsteadOfLoop.ts)_
**Severity:** 🔵 *Note*

### Unclear API Name
Maintaining multiple elements with a similar name, like `Copy_X_Of_Element`, can diminish the overall readability of your Flow. When copying and pasting these elements, remember to update the API name of the newly created copy.

**Rule ID:** `unclear-api-naming`
**Class Name:** _[CopyAPIName](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/CopyAPIName.ts)_
**Severity:** 🟡 *Warning*

### Unreachable Element
Avoid unconnected elements that are not used by the flow to keep flows efficient and maintainable.

**Rule ID:** `unreachable-element`
**Class Name:** _[UnconnectedElement](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/UnconnectedElement.ts)_
**Severity:** 🟡 *Warning*

### Unsafe Running Context
This flow is configured to run in System Mode without Sharing. This system context grants all running users the permission to view and edit all data in your org. Running a flow in System Mode without Sharing can lead to unsafe data access.

**Rule ID:** `unsafe-running-context`
**Class Name:** _[UnsafeRunningContext](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/UnsafeRunningContext.ts)_
**Severity:** 🔴 *Error*

### Unused Variable
To maintain efficiency and manageability, avoid including variables that are never referenced.

**Rule ID:** `unused-variable`
**Class Name:** _[UnusedVariable](https://github.com/Flow-Scanner/lightning-flow-scanner/blob/main/packages/core/src/main/rules/UnusedVariable.ts)_
**Severity:** 🟡 *Warning*
<!-- END GENERATED_RULES -->

## Configuration

It is recommend to configure and define:

- The severity of violating any specific rule.
- Expressions used for rules, such as REGEX patterns and comparison operators.
- Any known exceptions that should be ignored during scanning.

```json
{
  "rules": {
    // Your rules here
  },
  "exceptions": {
    // Your exceptions here
  }
}
```

Most Lightning Flow Scanner distributions automatically resolve configurations from `.flow-scanner.yml`, `.flow-scanner.json`, or `package.json` → `flowScanner`.

By default, all default rules are executed. You can customize individual rules and override the rules to be executed without having to specify every rule. Below is a breakdown of the available attributes of rule configuration:

```json
{
  "rules": {
    "<RuleId>": {
      "severity": "<Severity>", // Override severity level
      "expression": "<Expression>", // Override rule expression
      "enabled": "false" // Disable this rule
    }
  }
}
```

### Configure Severity Levels

When the severity is not provided it will be `warning` by default. Other available values for severity are `error` and `note`. Configure the severity per rule as shown below:

```json
{
  "rules": {
    "missing-flow-description": {
      "severity": "error"
    },
    "unused-variable": {
      "severity": "note"
    }
  }
}
```

### Overwrite Expressions

Some rules have an expression to configure, such as the expression, that will overwrite default values. These can be configured in the same way as severity as shown in the following example.

```json
{
  "rules": {
    "invalid-api-version": {
      "expression": "===58" // comparison operator
    },
    "invalid-naming-convention": {
      "expression": "[A-Za-z0-9]" // regular expression
    }
  }
}
```

### Define Exceptions

Defining exceptions allows you to exclude specific scenarios from rule enforcement. Exceptions can be specified at the flow, rule, or result level to provide fine-grained control. Below is a breakdown of the available attributes of exception configuration:

```json
{
  "exceptions": {
    "<FlowName>": {
      "<RuleId>": [
        "<ResultName>", // Suppress a result
        "*", // Wildcard to suppress all results
        ...
      ]
    },
    ...
  }
}
```

_Example_

```json
{
  "exceptions": {
    "MyFlow": {
      "hardcoded-id": ["Old_Lookup_1"],
      "missing-null-handler": ["*"]
    }
  }
}
```

### Scan Modes

#### Beta Mode

New rules are introduced in Beta mode before being added to the default ruleset. To include current Beta rules, enable the optional betamode parameter in your configuration:

```json
{
  "betaMode": true
}
```

#### Rule Mode

By default, Lightning Flow Scanner runs **all** default rules and merges any custom configurations you provide. This means you can override specific rules without having to list every rule to be executed. If instead, you want to run **only** the rules you explicitly specify, use `"ruleMode": "isolated"`:
```json
{
  "ruleMode": "isolated"
}
```


## Installation

`lightning-flow-scanner-vsx` is available on:

| Visual Studio Marketplace                                                                                                                                                                                                                          | Open VSX Registry                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [![VS Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ForceConfigControl.lightning-flow-scanner-vsx?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=ForceConfigControl.lightning-flow-scanner-vsx) | [![Open VSX Version](https://img.shields.io/open-vsx/v/ForceConfigControl/lightning-flow-scanner-vsx?label=Open%20VSX)](https://open-vsx.org/extension/ForceConfigControl/lightning-flow-scanner-vsx) |

To install via CLI (VS Code)

```bash
code --install-extension ForceConfigControl.lightning-flow-scanner-vsx
```

---

## Development

> This project optionally uses [Volta](https://volta.sh) to guarantee the exact same Node.js and tool versions for every contributor. Install Volta with:
>
> MacOs/Linux: 
> ```sh
> curl https://get.volta.sh | bash
> ```
> Windows:
> ```sh
> winget install Volta.Volta 
> ```
> Volta will automatically install and lock the tool versions defined in `package.json`.

1. Clone the repository

   ```bash
   git clone https://github.com/Flow-Scanner/lightning-flow-scanner.git
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Compile:

   ```bash
   pnpm run build:vsx
   ```

4. Run tests:

   ```bash
   pnpm test:vsx
   ```

<p><strong>Want to help improve Lightning Flow Scanner? See our <a href="https://github.com/Flow-Scanner/lightning-flow-scanner?tab=contributing-ov-file">Contributing Guidelines</a></strong></p>
