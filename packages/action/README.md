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
  <a href="https://github.com/Flow-Scanner">
    <img src="https://raw.githubusercontent.com/Flow-Scanner/Lightning-Flow-Scanner/main/docs/media/action.gif"/>
  </a>
</p>

---

## Table of contents

- **[Usage](#usage)**
  - [Run Manually](#run-manuallyworkflow_dispatch)
  - [Run On Pull Requests](#run-on-pull-requestspull_request)
  - [Run On Push](#run-on-pushpush)  
  - [Flags](#flags)  
- **[Default Rules](#default-rules)**
- **[Configuration](#configuration)**
- **[Development](#development)**

---

## Usage

Lightning Flow Scanner Action is plug-and-play. Just add the GitHub workflow file `.github/workflows/scan-flows.yml` to automatically detect 20+ issues in flows — hardcoded IDs, unsafe contexts, inefficient SOQL/DML, recursion risks, missing fault handling — directly in pull requests. Example:

```yaml
name: Scan Flows

on:
  pull_request:
    branches: [ main ]

jobs:
  scan-flows:
    runs-on: ubuntu-latest
    permissions:
      contents: read           # Read flow files
      security-events: write   # Upload SARIF to Code Scanning

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Lightning Flow Scanner
        id: flowscanner
        uses: Flow-Scanner/lightning-flow-scanner@main
        with:
          sarif-only: true # Strict mode for PRs

      - name: Upload SARIF to Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: ${{ steps.flowscanner.outputs.sarifPath }}
```
To set-up the action you must also Configure repository permissions:
- Navigate to _Repository Settings > Actions > General_.
- Under _Workflow permissions_, select:
- _Read and write permissions_.

**Privacy:** Zero user data collected. All processing is client-side.
→ See our [Security Policy](https://github.com/Flow-Scanner/lightning-flow-scanner-action?tab=security-ov-file).

### Run Manually(`workflow_dispatch`)
Trigger **Flow Scanner** on-demand to scan **all flows** in the repo.

```yaml
on: workflow_dispatch
```

- Navigate to the "Actions" tab of your GitHub repository.
- Click on "Lightning Flow Scanner" in the list of available workflows.
- Press the "Run workflow" button to trigger the action.

### Run on Pull Requests(`pull_request`)
Scan only changed flow files when a PR is opened or updated.

```
on:
  pull_request:
    branches: [ main ]
```

In Settings → Actions → General, ensure:
"Allow GitHub Actions to create and approve pull requests" is checked

### Run On Push(`push`)
Scan all flows on every push to selected branches.

`on:push:branches: [ main ]:` will trigger Flow Scanner to scan the every time a new change is pushed to the provide a list of branch names.

### Flags

| Input          | Default          | Description                                                                 |
|----------------|------------------|-----------------------------------------------------------------------------|
| `GITHUB_TOKEN` | `github.token`   | GitHub token for API access. **Usually not required** — the default token works in nearly all cases. |
| `config`       | auto-detect      | Path to configuration file (e.g., `.flow-scanner.yaml`).                    |
| `threshold`    | `error`          | Fail if issues of this severity or higher are found (`note`, `warning`, `error`). |
| `sarif-only`   | `false`          | Only generate SARIF (no structured output). Fails on any violation.         |
| `betaMode`     | `false`          | Enable beta rules at run-time (experimental).                               |
| `branch`       | auto-detect      | Branch to scan (defaults to event branch or repository default).            |

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
- Flows or directories to exclude from scanning entirely.

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

### Exclude Flows from Scanning

Lightning Flow Scanner provides two complementary ways to exclude flows from scanning:

#### Exclude by File Path (Node.js only)

Use glob patterns to exclude flows based on their file system location. This is useful for excluding entire directories or specific file patterns during the flow discovery phase:

```json
{
  "ignore": [
    "**/testing/**",
    "**/*_Deprecated.flow-meta.xml"
  ]
}
```

**Note**: The `ignore` option uses glob patterns and applies during file discovery before flows are parsed. This is the most efficient way to exclude large numbers of flows.

**Environment compatibility**: `ignore` requires Node.js (file system access) and is available in CLI Plugin, VS Code Extension, and GitHub Action. It is **not** available when using the Core Library in browser/web environments.

#### Exclude by Flow API Name (Browser-compatible)

Exclude specific flows by their unique API names, regardless of their location. This is particularly useful for:
- Excluding specific flows without knowing their exact file path
- Working with metadata API deployments where directory structures may vary
- More precise control than path-based patterns

```json
{
  "ignoreFlows": [
    "My_Legacy_Flow",
    "Temporary_Test_Flow",
    "Deprecated_Process_Builder"
  ]
}
```

**Note**: The `ignoreFlows` option applies after flows are parsed, using the flow's API name (the `<fullName>` element in the flow metadata). Flow names are unique identifiers and work regardless of the flow's file system location.

**Environment compatibility**: `ignoreFlows` works in **all environments** including Node.js and browser/web distributions, as it operates on parsed flow data rather than file system paths.

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

To debug the action you need to:

- _Install [`ncc`](https://www.npmjs.com/package/@vercel/ncc) for compilation. On MacOs/ Unix run:_
```bash
npm i -g @vercel/ncc
```

- _Install [`docker`](https://www.docker.com/) and [`act`](https://nektosact.com/installation/index.html) to run GitHub Actions locally. On MacOs/ Unix run:_
```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash 
```

1. Clone the repository

   ```bash
   git clone https://github.com/Flow-Scanner/lightning-flow-scanner.git
   ```

2. Compile a new version
```bash
pnpm build:action
```

2. Test the workflows locally:
When running locally with `act`, you need to create a `.secrets` file in the repo root(Recommended to use a Classic Personal Access Token with `repo` scope):

```bash
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
Then test with:

```bash
act workflow_dispatch --secret-file .secrets
```

**Want to help improve [Lightning Flow Scanner](https://github.com/Flow-Scanner)? See our [Contributing Guidelines](https://github.com/Flow-Scanner/lightning-flow-scanner-core/blob/main/CONTRIBUTING.md).**
