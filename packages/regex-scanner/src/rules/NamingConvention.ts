import { MetadataFile } from "../models/MetadataFile";
import { RegexRule } from "../models/RegexRule";
import { RegexViolation, RegexRuleConfig } from "../models/RegexViolation";

/**
 * Validates that metadata file names follow a configurable naming convention.
 * Default pattern requires format like "Domain_Description" (e.g., "Service_OrderFulfillment").
 */
export class NamingConvention extends RegexRule {
  /** Default regex pattern if none configured */
  public static readonly DEFAULT_PATTERN = "[A-Za-z0-9]+_[A-Za-z0-9]+";

  constructor() {
    super({
      ruleId: "naming-convention",
      name: "NamingConvention",
      label: "Naming Convention",
      description:
        "Using clear and consistent names improves readability, discoverability, and maintainability. A good naming convention helps team members quickly understand a file's purpose—for example, including a domain and brief description like Service_OrderFulfillment.",
      summary: "Consistent naming improves discoverability and maintainability",
      severity: "error",
      supportedTypes: ["Flow"], // Start with Flow only, extensible later
      docRefs: [
        {
          label: "Naming your Flows is more critical than ever",
          path: "https://www.linkedin.com/posts/stephen-n-church_naming-your-flows-this-is-more-critical-activity-7099733198175158274-1sPx",
        },
      ],
      isConfigurable: true,
    });
  }

  protected check(
    file: MetadataFile,
    config?: RegexRuleConfig
  ): RegexViolation[] {
    const pattern = config?.expression ?? NamingConvention.DEFAULT_PATTERN;
    const name = file.name ?? "";

    // Test if name matches the pattern
    if (new RegExp(pattern).test(name)) {
      return []; // Matches = pass
    }

    // Name doesn't match pattern - create violation
    return [
      this.createViolation(file, {
        name: name,
        type: "name",
        metaType: "attribute",
        expression: pattern,
        message: this.description,
      }),
    ];
  }
}
