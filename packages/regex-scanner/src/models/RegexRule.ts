import { MetadataFile } from "./MetadataFile";
import { RegexViolation, RegexRuleConfig } from "./RegexViolation";

/**
 * Metadata that defines a regex rule
 */
export interface RegexRuleInfo {
  /** Canonical rule ID, e.g., "naming-convention" */
  ruleId: string;
  /** Legacy class name for backward compatibility */
  name: string;
  /** Short label for UI display */
  label: string;
  /** Detailed description of what the rule checks */
  description: string;
  /** Brief summary (5-10 words) */
  summary: string;
  /** Default severity */
  severity: "error" | "warning" | "note";
  /** Metadata types this rule supports, e.g., ["Flow", "ApexClass"] */
  supportedTypes: string[];
  /** Documentation references */
  docRefs?: Array<{ label: string; path: string }>;
  /** Whether the rule accepts configuration options */
  isConfigurable: boolean;
}

/**
 * Base class for all regex-based rules.
 * Rules extend this and implement the `check` method.
 */
export abstract class RegexRule {
  public readonly ruleId: string;
  public readonly name: string;
  public readonly label: string;
  public readonly description: string;
  public readonly summary: string;
  public readonly supportedTypes: string[];
  public readonly docRefs: Array<{ label: string; path: string }>;
  public readonly isConfigurable: boolean;

  public severity: "error" | "warning" | "note";

  constructor(info: RegexRuleInfo) {
    this.ruleId = info.ruleId;
    this.name = info.name;
    this.label = info.label;
    this.description = info.description;
    this.summary = info.summary;
    this.severity = info.severity;
    this.supportedTypes = info.supportedTypes;
    this.docRefs = info.docRefs ?? [];
    this.isConfigurable = info.isConfigurable;
  }

  /**
   * Execute the rule against a metadata file.
   * Handles type filtering and config merging before calling check().
   */
  public execute(
    file: MetadataFile,
    config?: RegexRuleConfig
  ): RegexViolation[] {
    // Skip if file type not supported ("*" matches any type)
    if (!this.supportedTypes.includes("*") && !this.supportedTypes.includes(file.metadataType)) {
      return [];
    }

    // Skip if explicitly disabled
    if (config?.enabled === false) {
      return [];
    }

    // Apply severity override
    const effectiveSeverity = config?.severity ?? this.severity;

    // Run the rule check
    const violations = this.check(file, config);

    // Apply config overrides to violations
    return violations.map((v) => ({
      ...v,
      severity: effectiveSeverity,
      message: config?.message ?? v.message,
      messageUrl: config?.messageUrl ?? v.messageUrl,
    }));
  }

  /**
   * Abstract method that subclasses implement to perform the actual check.
   * Should return violations with default severity/message (execute() will override).
   */
  protected abstract check(
    file: MetadataFile,
    config?: RegexRuleConfig
  ): RegexViolation[];

  /**
   * Helper to create a violation with common fields populated
   */
  protected createViolation(
    file: MetadataFile,
    overrides: Partial<RegexViolation>
  ): RegexViolation {
    return {
      file: file.filePath?.replace(/\\/g, "/") ?? file.fileName,
      fileName: file.fileName,
      metadataType: file.metadataType,
      ruleId: this.ruleId,
      ruleName: this.name,
      severity: this.severity,
      message: this.description,
      lineNumber: 1,
      columnNumber: 1,
      name: file.name,
      type: "name",
      metaType: "attribute",
      ...overrides,
    };
  }
}
