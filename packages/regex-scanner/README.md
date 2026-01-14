# @flow-scanner/regex-scanner

A generic regex-based scanning engine for metadata files. This package provides a lightweight, extensible framework for detecting patterns in metadata content.

## Installation

```bash
npm install @flow-scanner/regex-scanner
```

## Usage

```typescript
import { scanRegex, MetadataFile } from "@flow-scanner/regex-scanner";

const file: MetadataFile = {
  name: "My_Flow",
  fileName: "My_Flow.flow-meta.xml",
  metadataType: "Flow",
  content: "<Flow>...</Flow>",
};

const violations = scanRegex([file]);
```

## Built-in Rules

| Rule ID | Description |
|---------|-------------|
| `naming-convention` | Validates file names match a configurable pattern |
| `hardcoded-id` | Detects hardcoded Salesforce record IDs (15/18 char) |
| `hardcoded-url` | Detects hardcoded force.com URLs |
| `hardcoded-secret` | Detects API keys, tokens, and credentials |

## Configuration

```typescript
import { scanRegex, RegexScanConfig } from "@flow-scanner/regex-scanner";

const config: RegexScanConfig = {
  rules: {
    "naming-convention": {
      enabled: true,
      expression: "[A-Z][a-z]+_[A-Z][a-z]+", // Custom pattern
      severity: "warning",
    },
    "hardcoded-id": {
      enabled: false, // Disable this rule
    },
  },
};

const violations = scanRegex(files, config);
```

## Creating Custom Rules

Extend the `RegexRule` base class:

```typescript
import { RegexRule, MetadataFile, RegexViolation } from "@flow-scanner/regex-scanner";

export class MyCustomRule extends RegexRule {
  constructor() {
    super({
      ruleId: "my-custom-rule",
      name: "MyCustomRule",
      label: "My Custom Rule",
      description: "Detects something specific",
      summary: "Short summary",
      severity: "warning",
      supportedTypes: ["Flow", "ApexClass"],
      isConfigurable: false,
    });
  }

  protected check(file: MetadataFile): RegexViolation[] {
    const violations: RegexViolation[] = [];
    // Your regex logic here
    return violations;
  }
}
```

## API

### Functions

- `scanRegex(files, config?)` - Scan multiple files, returns violations
- `scanFile(file, config?)` - Scan a single file
- `getRegexRuleIds()` - Get all available rule IDs
- `hasRegexRule(id)` - Check if a rule exists

### Models

- `MetadataFile` - Input file representation
- `RegexViolation` - Output violation with location info
- `RegexScanConfig` - Configuration for scan behavior
- `RegexRule` - Base class for rules