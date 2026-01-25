export type RuleDefinitionExpression = {
  options?: {
    expression?: unknown;
  };
};

/**
 * Represents a rule metadata; this contains properties to describe the rule
 */
export class RuleInfo {
  /**
   * A human-readable description of the rule.
   */
  public description: string;

  /**
   * A short summary (5-10 words) used when no custom message is provided.
   */
  public summary: string;

  /**
   * An array of documentation references related to the rule.
   */
  public docRefs: Array<{ label: string; path: string }>;

  /**
   * The display label for the rule.
   * This property is being displayed on sf cli and on vsce
   */
  public label: string;

  /**
   * The category for the rule.
   * 'problem' | 'suggestion' | 'layout' | 'system'
   * System rules catch issues prevented by Flow Builder UI (valuable for AI-edited XML)
   */
  public category: 'problem' | 'suggestion' | 'layout' | 'system';

  /**
   * Stable public identifier used for config, suppression, and reporting.
   */
  public ruleId: string;

  /**
   * Legacy rule name (class-based identifier).
   * Kept for backward compatibility.
   */
  public name: string;

  /**
   * The types supported by this rule (e.g., Flow, Process).
   * Use defined types in @see FlowType
   */
  public supportedTypes: string[];
}
