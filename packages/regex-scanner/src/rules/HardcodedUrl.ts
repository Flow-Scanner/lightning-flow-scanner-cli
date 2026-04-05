import { MetadataFile } from "../models/MetadataFile";
import { RegexRule } from "../models/RegexRule";
import { RegexViolation, RegexRuleConfig } from "../models/RegexViolation";
import { stripDescriptionContent } from "../utils/stripDescriptionContent";

/**
 * Detects hardcoded Salesforce URLs (force.com domains) in metadata files.
 */
export class HardcodedUrl extends RegexRule {
  /**
   * Regex pattern for force.com URLs:
   * - http or https protocol
   * - optional www prefix
   * - domain characters
   * - ending with force.com
   */
  public static readonly FORCE_URL_PATTERN =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}force\.com/g;

  constructor() {
    super({
      ruleId: "hardcoded-url",
      name: "HardcodedUrl",
      label: "Hardcoded Salesforce Url",
      description:
        "Avoid hard-coding URLs, as they may change between environments or over time. Instead, store URLs in variables or custom settings to make the Flow adaptable, maintainable, and environment-independent.",
      summary: "Hardcoded URLs break across different environments",
      severity: "error",
      supportedTypes: ["*"],
      docRefs: [
        {
          label: "The Ultimate Guide to Salesforce Flow Best Practices",
          path: "https://admin.salesforce.com/blog/2021/the-ultimate-guide-to-flow-best-practices-and-standards",
        },
        {
          label: "Why You Should Avoid Hard Coding and Three Alternative Solutions",
          path: "https://admin.salesforce.com/blog/2021/why-you-should-avoid-hard-coding-and-three-alternative-solutions",
        },
      ],
      isConfigurable: false,
    });
  }

  protected check(
    file: MetadataFile,
    _config?: RegexRuleConfig
  ): RegexViolation[] {
    const violations: RegexViolation[] = [];

    // If elements are provided, search each element
    if (file.elements && file.elements.length > 0) {
      for (const element of file.elements) {
        // Strip description content to avoid false positives from documentation
        const rawContent =
          typeof element.content === "string"
            ? element.content
            : JSON.stringify(element.content);
        const content = stripDescriptionContent(rawContent);

        // Reset regex state for each element
        const regex = new RegExp(HardcodedUrl.FORCE_URL_PATTERN);
        const matches = content.match(regex);

        if (matches) {
          violations.push(
            this.createViolation(file, {
              name: element.name,
              type: element.type,
              metaType: "element",
              matchedText: matches[0], // First match
              message: this.description,
            })
          );
        }
      }
    } else {
      // Fall back to searching raw content (strip descriptions)
      const content = stripDescriptionContent(file.content);
      const regex = new RegExp(HardcodedUrl.FORCE_URL_PATTERN);
      const matches = content.match(regex);

      if (matches) {
        for (const match of matches) {
          violations.push(
            this.createViolation(file, {
              name: file.name,
              type: "content",
              metaType: "content",
              matchedText: match,
              message: this.description,
            })
          );
        }
      }
    }

    return violations;
  }
}
