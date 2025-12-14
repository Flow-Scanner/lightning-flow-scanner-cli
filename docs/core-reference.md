
# Core Advance

This document is intentionally developer-focused, providing the technical depth needed for core library users such as Programmatic API, types, and advanced usage of `@flow-scanner/lightning-flow-scanner-core`.

## Functions

[`getRules(ruleNames?: string[]): IRuleDefinition[]`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/GetRuleDefinitions.ts)

_Retrieves rule definitions used in the scanner._

[`parse(selectedUris: any): Promise<ParsedFlow[]>`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/ParseFlows.ts)

_Loads Flow XML files into in-memory models.(Node.js only)_

[`scan(parsedFlows: ParsedFlow[], ruleOptions?: IRulesConfig): ScanResult[]`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/ScanFlows.ts)

_Runs all enabled rules and returns detailed violations._

[`fix(results: ScanResult[]): ScanResult[]`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/FixFlows.ts)

_Automatically applies available fixes(removing variables and unconnected elements)._

[`exportSarif(results: ScanResult[]): string`](https://github.com/Flow-Scanner/lightning-flow-scanner/tree/main/src/main/libs/ExportSarif.ts)

_Get SARIF output including exact line numbers of violations._

[`exportDiagram(results: ScanResult[]): string`](https://github.com/Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/libs/ExportDiagram.ts)

_Generates Markdown documentation for parsed flows, including Mermaid diagrams for valid flows. Filters out errored parses and optionally includes parse errors._

## Types

```
interface ParsedFlow {
  uri: string;
  flow?: Flow;
  errorMessage?: string;
}

interface ScanResult {
  flow: Flow;
  ruleResults: RuleResult[];
}

interface RuleResult {
  ruleName: string;
  ruleDefinition: IRuleDefinition;
  occurs: boolean;
  details: Violation[];
  severity: string;
}
```