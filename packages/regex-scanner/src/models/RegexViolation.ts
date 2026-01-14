/**
 * Flat violation output from regex scanner.
 * Designed to be compatible with FlatViolation from core, with no nested `details` object.
 */
export interface RegexViolation {
  // File context
  /** File path (normalized with forward slashes) */
  file: string;
  /** File name without path */
  fileName: string;
  /** Salesforce metadata type, e.g., "Flow", "ApexClass" */
  metadataType: string;

  // Rule context
  /** Canonical rule ID, e.g., "naming-convention" */
  ruleId: string;
  /** Legacy rule name for backward compatibility, e.g., "NamingConvention" */
  ruleName: string;
  /** Severity level */
  severity: "error" | "warning" | "note";
  /** Human-readable violation message */
  message: string;
  /** Optional URL to documentation */
  messageUrl?: string;

  // Location in file
  /** Line number (1-indexed) */
  lineNumber: number;
  /** Column number (1-indexed) */
  columnNumber: number;

  // Match context
  /** Name of the element/attribute that violated */
  name: string;
  /** Element type, e.g., "name", "actionCalls" */
  type: string;
  /** Meta type: "attribute" for file-level, "element" for parsed elements, "content" for raw matches */
  metaType: "attribute" | "element" | "content";

  // Flattened properties (no nested details object)
  /** The regex pattern that was used */
  expression?: string;
  /** The text that was matched by the regex (for hardcoded ID/URL rules) */
  matchedText?: string;
}

/**
 * Configuration for a regex rule
 */
export interface RegexRuleConfig {
  /** Whether the rule is enabled */
  enabled?: boolean;
  /** Override severity */
  severity?: "error" | "warning" | "note";
  /** Custom regex expression (for configurable rules) */
  expression?: string;
  /** Custom message override */
  message?: string;
  /** Custom documentation URL */
  messageUrl?: string;
}

/**
 * Overall configuration for the regex scanner
 */
export interface RegexScanConfig {
  /** Per-rule configuration keyed by ruleId */
  rules?: Record<string, RegexRuleConfig>;
}
