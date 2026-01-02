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

---

## Table of contents

- **[Default Rules](#default-rules)**
- **[Configuration](#configuration)**
  - [Configure Severity Levels](#configure-severity-levels)
  - [Overwrite Expressions](#overwrite-expressions)
  - [Define Exceptions](#define-exceptions)
  - [Exclude Flows from Scanning](#exclude-flows-from-scanning)
  - [Scan Modes](#scan-modes)
- **[Installation](#installation)**
  - [Distributions](#distributions)
  - [CICD Templates](#cicd-templates)
- **[Quick Start](#quick-start)**
- **[Development](#development)**

---

## Default Rules

<p>📌<strong>Tip:</strong> To link directly to a specific rule, use the full GitHub anchor link format. Example:</p>
<p><em><a href="https://flow-scanner.github.io/lightning-flow-scanner/#unsafe-running-context">https://flow-scanner.github.io/lightning-flow-scanner/#unsafe-running-context</a></em></p>

> Want to code a new rule? → See [How to Write a Rule](docs/write-a-rule.md)

<!-- START GENERATED_RULES -->
### Action Call In A Loop
To prevent exceeding Apex governor limits, it is advisable to consolidate and bulkify your apex calls, utilizing a single action call containing a collection variable at the end of the loop.

**Rule ID:** `action-call-in-loop`
**Class Name:** _[ActionCallsInLoop](packages/core/src/main/rules/ActionCallsInLoop.ts)_
**Severity:** 🔴 *Error*

### DML Statement In A Loop
To prevent exceeding Apex governor limits, consolidate all your database operations—record creation, updates, or deletions—at the conclusion of the flow.

**Rule ID:** `dml-in-loop`
**Class Name:** _[DMLStatementInLoop](packages/core/src/main/rules/DMLStatementInLoop.ts)_
**Severity:** 🔴 *Error*

### Duplicate DML Operation
When a flow executes database changes or actions between two screens, prevent users from navigating backward between screens; otherwise, duplicate database operations may be performed.

**Rule ID:** `duplicate-dml`
**Class Name:** _[DuplicateDMLOperation](packages/core/src/main/rules/DuplicateDMLOperation.ts)_
**Severity:** 🟡 *Warning*

### Excessive Cyclomatic Complexity
The number of loops and decision rules, plus the number of decisions. Use a combination of 1) subflows and 2) breaking flows into multiple concise trigger ordered flows, to reduce the cyclomatic complexity within a single flow, ensuring maintainability and simplicity.

**Rule ID:** `excessive-cyclomatic-complexity`
**Class Name:** _[CyclomaticComplexity](packages/core/src/main/rules/CyclomaticComplexity.ts)_
**Severity:** 🔵 *Note*

### Flow Naming Convention
The readability of a flow is paramount. Establishing a naming convention significantly enhances findability, searchability, and overall consistency. Include at least a domain and a brief description of the flow’s actions, for example `Service_OrderFulfillment`.

**Rule ID:** `invalid-naming-convention`
**Class Name:** _[FlowName](packages/core/src/main/rules/FlowName.ts)_
**Severity:** 🔴 *Error*

### Get Record All Fields
Following the principle of least privilege (PoLP), avoid using **Get Records** with “Automatically store all fields” unless necessary.

**Rule ID:** `get-record-all-fields`
**Class Name:** _[GetRecordAllFields](packages/core/src/main/rules/GetRecordAllFields.ts)_
**Severity:** 🟡 *Warning*

### Hardcoded Id
Avoid hard-coding IDs because they are org specific. Instead, pass them into variables at the start of the flow—via merge-field URL parameters or a **Get Records** element.

**Rule ID:** `hardcoded-id`
**Class Name:** _[HardcodedId](packages/core/src/main/rules/HardcodedId.ts)_
**Severity:** 🔴 *Error*

### Hardcoded Url
Avoid hard-coding URLs because they are environment specific. Use an `$API` formula (preferred) or environment-specific sources like custom labels, metadata, or settings.

**Rule ID:** `hardcoded-url`
**Class Name:** _[HardcodedUrl](packages/core/src/main/rules/HardcodedUrl.ts)_
**Severity:** 🔴 *Error*

### Inactive Flow
Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble—such as accidentally deleting records during testing, or being activated as subflows.

**Rule ID:** `inactive-flow`
**Class Name:** _[InactiveFlow](packages/core/src/main/rules/InactiveFlow.ts)_
**Severity:** 🟡 *Warning*

### Invalid API Version
Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the **Api Version** attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.

**Rule ID:** `invalid-api-version`
**Class Name:** _[APIVersion](packages/core/src/main/rules/APIVersion.ts)_
**Severity:** 🟡 *Warning*

### Missing Auto Layout
With Canvas Mode set to Auto-Layout, elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized—saving you time.

**Rule ID:** `missing-auto-layout`
**Class Name:** _[AutoLayout](packages/core/src/main/rules/AutoLayout.ts)_
**Severity:** 🔵 *Note*

### Missing Fault Path
A flow may fail to execute an operation as intended. By default, the flow displays an error to the user and emails the creator. Customize this behavior by incorporating a Fault Path.

**Rule ID:** `missing-fault-path`
**Class Name:** _[MissingFaultPath](packages/core/src/main/rules/MissingFaultPath.ts)_
**Severity:** 🟡 *Warning*

### Missing Filter Record Trigger ![Beta](https://img.shields.io/badge/status-beta-yellow)
Record-triggered flows that lack filters on changed fields or entry conditions can lead to unnecessary executions on every record change. This may degrade system performance, hit governor limits faster, and increase resource consumption in high-volume orgs.

**Rule ID:** `missing-record-trigger-filter`
**Class Name:** _[MissingFilterRecordTrigger](packages/core/src/main/rules/MissingFilterRecordTrigger.ts)_
**Severity:** 🟡 *Warning*

### Missing Flow Description
Descriptions play a vital role in documentation. It is highly recommended to include details about where a flow is used and its intended purpose.

**Rule ID:** `missing-flow-description`
**Class Name:** _[FlowDescription](packages/core/src/main/rules/FlowDescription.ts)_
**Severity:** 🔴 *Error*

### Missing Metadata Description ![Beta](https://img.shields.io/badge/status-beta-yellow)
Flags Flow elements (Get Records, Assignments, Decisions, Actions, etc.) and metadata components (Variables, Formulas, Constants, Text Templates) that lack a description. Adding concise descriptions greatly improves readability, maintainability, and helps AI tools understand your automation intent.

**Rule ID:** `missing-metadata-description`
**Class Name:** _[MissingMetadataDescription](packages/core/src/main/rules/MissingMetadataDescription.ts)_
**Severity:** 🔴 *Error*

### Missing Null Handler
When a **Get Records** operation finds no data, it returns `null`. Validate data by using a Decision element to check for a non-null result.

**Rule ID:** `missing-null-handler`
**Class Name:** _[MissingNullHandler](packages/core/src/main/rules/MissingNullHandler.ts)_
**Severity:** 🟡 *Warning*

### Missing Trigger Order
Guarantee your flow execution order with the **Trigger Order** property introduced in Spring '22.value to their flows and guarantee their execution order. This priority value is not an absolute value, so the values need not be sequentially numbered as 1, 2, 3, and so on.

**Rule ID:** `unspecified-trigger-order`
**Class Name:** _[TriggerOrder](packages/core/src/main/rules/TriggerOrder.ts)_
**Severity:** 🔵 *Note*

### Process Builder
Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Begin migrating your organization’s automation to Flow.

**Rule ID:** `process-builder-usage`
**Class Name:** _[ProcessBuilder](packages/core/src/main/rules/ProcessBuilder.ts)_
**Severity:** 🟡 *Warning*

### Record ID as String ![Beta](https://img.shields.io/badge/status-beta-yellow)
Detects flows using a String variable named `recordId` as input when they could receive the entire record object instead. Since recent Salesforce releases, record pages and quick actions can pass the complete record, eliminating the need for an additional Get Records query and improving performance.

**Rule ID:** `record-id-as-string`
**Class Name:** _[RecordIdAsString](packages/core/src/main/rules/RecordIdAsString.ts)_
**Severity:** 🔴 *Error*

### Recursive After Update
After-update flows are meant for modifying **other** records. Using them on the same record can cause recursion. Consider **before-save** flows for same-record updates.

**Rule ID:** `recursive-record-update`
**Class Name:** _[RecursiveAfterUpdate](packages/core/src/main/rules/RecursiveAfterUpdate.ts)_
**Severity:** 🟡 *Warning*

### Same Record Field Updates
Similar to triggers, **before-save** contexts can update the same record via `$Record` without invoking DML.

**Rule ID:** `same-record-field-updates`
**Class Name:** _[SameRecordFieldUpdates](packages/core/src/main/rules/SameRecordFieldUpdates.ts)_
**Severity:** 🟡 *Warning*

### SOQL Query In A Loop
To prevent exceeding Apex governor limits, consolidate all SOQL queries at the end of the flow.

**Rule ID:** `soql-in-loop`
**Class Name:** _[SOQLQueryInLoop](packages/core/src/main/rules/SOQLQueryInLoop.ts)_
**Severity:** 🔴 *Error*

### Transform Instead of Loop ![Beta](https://img.shields.io/badge/status-beta-yellow)
Detects Loop elements that directly connect to Assignment elements. Transform elements handle collection manipulation in bulk operations, providing significant performance improvements over iterative loop-assignment patterns.

**Rule ID:** `transform-instead-of-loop`
**Class Name:** _[TransformInsteadOfLoop](packages/core/src/main/rules/TransformInsteadOfLoop.ts)_
**Severity:** 🔵 *Note*

### Unclear API Name
Maintaining multiple elements with a similar name, like `Copy_X_Of_Element`, can diminish the overall readability of your Flow. When copying and pasting these elements, remember to update the API name of the newly created copy.

**Rule ID:** `unclear-api-naming`
**Class Name:** _[CopyAPIName](packages/core/src/main/rules/CopyAPIName.ts)_
**Severity:** 🟡 *Warning*

### Unreachable Element
Avoid unconnected elements that are not used by the flow to keep flows efficient and maintainable.

**Rule ID:** `unreachable-element`
**Class Name:** _[UnconnectedElement](packages/core/src/main/rules/UnconnectedElement.ts)_
**Severity:** 🟡 *Warning*

### Unsafe Running Context
This flow is configured to run in System Mode without Sharing. This system context grants all running users the permission to view and edit all data in your org. Running a flow in System Mode without Sharing can lead to unsafe data access.

**Rule ID:** `unsafe-running-context`
**Class Name:** _[UnsafeRunningContext](packages/core/src/main/rules/UnsafeRunningContext.ts)_
**Severity:** 🔴 *Error*

### Unused Variable
To maintain efficiency and manageability, avoid including variables that are never referenced.

**Rule ID:** `unused-variable`
**Class Name:** _[UnusedVariable](packages/core/src/main/rules/UnusedVariable.ts)_
**Severity:** 🟡 *Warning*
<!-- END GENERATED_RULES -->

---

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

## Installation

### Distributions

| Distribution                                      | Best for                                      | Install                                                                                           |
|----------------------------------------------------------------|-----------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **[Salesforce CLI Plugin](https://www.npmjs.com/package/lightning-flow-scanner)** | Local development, scratch orgs, CI/CD        | `sf plugins install lightning-flow-scanner`                                                             |
| **[VS Code Extension](https://open-vsx.org/extension/ForceConfigControl/lightning-flow-scanner-vsx)** | Real-time scanning inside VS Code             | `code --install-extension ForceConfigControl.lightning-flow-scanner-vsx`                               |
| **[Salesforce App (Managed Package)](https://github.com/Flow-Scanner/lightning-flow-scanner-app)** | Run scans directly inside a Salesforce org  | `sf package install --package 04tgK0000008CLlQAM` |
| **[GitHub Action](https://github.com/marketplace/actions/lightning-flow-scan)** | Native PR checks        | `uses: Flow-Scanner/lightning-flow-scanner@main` |
| **[Core Library](https://www.npmjs.com/package/@flow-scanner/lightning-flow-scanner-core)** (Node.js + Browser) | Custom tools, scripts, extensions, web apps   | `npm install -g @flow-scanner/lightning-flow-scanner-core`                                                 |

**Privacy:** Zero user data collected. All processing is client-side. → See our [Security Policy](SECURITY.md).

### CICD Templates
Ready-to-use CI/CD templates and a **Copado Plugin**.

| Platform       | Type                     | Link |
|----------------|-----------------------------------|------|
| [Azure DevOps](docs/azure-templates.md)   | Full Project Scan                 | [`azure-pipelines-flow-FullScan.yml`](docs/templates/azure-devops/azure-pipelines-flow-FullScan.yml) |
| [Azure DevOps](docs/azure-templates.md)   | Change-Based Scan                 | [`azure-pipelines-flow-changedFiles.yml`](docs/templates/azure-devops/azure-pipelines-flow-changedFiles.yml) |
| **[Copado Plugin](https://github.com/Flow-Scanner/lightning-flow-scanner-copado)** | Copado Plugin                       | [Copado Marketplace](https://success.copado.com/s/listing-detail?language=en_US&recordId=a54P7000003G3gBIAS) |

## Quick Start

### Salesforce CLI Plugin

Use `lightning-flow-scanner` in the Salesforce CLI:

```bash
sf flow:scan # Scan flows in the current directory
sf flow:scan --sarif > report.sarif # Export scan results as SARIF
sf flow scan --csv > results.csv # Export scan results as CSV
sf flow doc > flow-docs.md # Generate flow documentation (Single markdown file)
sf flow doc --output flow-docs --separate # Generate one Markdown file per flow
sf flow:fix -d src/force-app # Fix flows in a specific directory
```

For full details, see the [CLI Readme](packages/cli/README.md).

### VS Code Extension
Use our side bar or the **Command Palette** and type `flow scanner` to see the list of all available commands.

* `Configure Scanner` - Set up rules in `.flow-scanner.yml`
* `Scan Flows` - Analyze a directory or selected flow files
* `Fix Flows` - Automatically apply available fixes
* `Generate Flow Documentation` - Generate flow documentation
* `Open Scanner Documentation` - Open the rules reference guide

For full details, see the [VSX Readme](packages/vsx/README.md).

### GitHub Action
Add a GitHub workflow file `.github/workflows/scan-flows.yml` to detect issues directly in pull requests:

```yaml
- name: Lightning Flow Scan
  id: flowscanner
  uses: Flow-Scanner/lightning-flow-scanner@main
  with:
    sarif-only: true  # Strict mode for PRs

- name: Upload SARIF to Code Scanning
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: ${{ steps.flowscanner.outputs.sarifPath }}
```

For full details, see the [Action Readme](packages/action/README.md).

### Core Module
Use `lightning-flow-scanner-core` as a Node.js/browser dependency:

```js
// Basic
import { parse, scan } from "@flow-scanner/lightning-flow-scanner-core";
parse("flows/*.xml").then(scan);

// Get SARIF output (e.g. for GitHub Code Scanning)
import { parse, scan, exportSarif } from "@flow-scanner/lightning-flow-scanner-core";
parse("flows/**/*.flow-meta.xml").then(scan).then(exportSarif)
  // .then(sarif => fs.writeFile("results.sarif", sarif))

// Generate Markdown documentation with Mermaid flow diagrams
import { parse, exportDiagram } from "@flow-scanner/lightning-flow-scanner-core";
parse("flows/**/*.flow-meta.xml").then(exportDiagram)
  // .then(md => fs.writeFile("flow-docs.md", md))

// Browser Usage (Tooling API)
const { Flow, scan } = window.lightningflowscanner;
const metadataRes = await conn.tooling.query(`SELECT Id, FullName, Metadata FROM Flow`);
const results = scan(
  metadataRes.records.map((r) => ({
    uri: `/services/data/v60.0/tooling/sobjects/Flow/${r.Id}`,
    flow: new Flow(r.FullName, r.Metadata),
  })) //, optionsForScan
);
```

For more on Programmatic API, types, and advanced usage of `@flow-scanner/lightning-flow-scanner-core`, see the [Core Library Reference](docs/core-reference.md).

## Development

> This project optionally uses [Volta](https://volta.sh) to guarantee the exact same Node.js and tool versions for every contributor.
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
   pnpm run build
   ```

   To compile just the core package::
   ```bash
   pnpm build:core
   ```

4. Run tests:

   ```bash
   pnpm test
   ```

    Or to test a new version of the core:
    ```bash
    pnpm test:core
    ```

5. Linking the core module locally(Optional):

   To link the module, run:

   ```bash
   pnpm link --global @flow-scanner/lightning-flow-scanner-core
   ```

   You can now do Ad-Hoc Testing with node:

   ```bash
   node -i -e "import('@flow-scanner/lightning-flow-scanner-core').then(m => { Object.assign(global, m.default ? m.default : m); console.log('✅ Core loaded! Try: await parse(...), scan(...), etc.'); })"
   ```

    Or test in a dependent project with `npm link @flow-scanner/lightning-flow-scanner-core`

6. Deploy Demo Flows (Optional):

   ```bash
   cd example-flows && sf project deploy start
   ```

   Navigate to the [Demo Readme](example-flows/README.md) for full details

7. Create a standalone UMD Module(Optional):

   ```bash
     pnpm dist
   ```
   This creates UMD at `dist/lightning-flow-scanner-core.umd.js`.

**Want to help improve Lightning Flow Scanner? See our [Contributing Guidelines](CONTRIBUTING.md)**
