import { MetadataFile } from "../models/MetadataFile";
import { RegexRule } from "../models/RegexRule";
import { RegexViolation, RegexRuleConfig } from "../models/RegexViolation";

/**
 * Detects hardcoded Salesforce record IDs in metadata files.
 * Salesforce IDs are 15 or 18 character alphanumeric strings with a specific pattern.
 */
export class HardcodedId extends RegexRule {
  /**
   * Regex pattern for Salesforce IDs:
   * - 5 alphanumeric chars
   * - followed by '0' (key prefix delimiter)
   * - followed by 9 alphanumeric chars
   * - optionally followed by 3 more chars (18-char ID)
   */
  public static readonly SALESFORCE_ID_PATTERN =
    /\b[a-zA-Z0-9]{5}0[a-zA-Z0-9]{9}(?:[a-zA-Z0-9]{3})?\b/g;

  constructor() {
    super({
      ruleId: "hardcoded-id",
      name: "HardcodedId",
      label: "Hardcoded Salesforce Id",
      description:
        "Avoid hard-coding record IDs, as they are unique to a specific org and will not work in other environments. Instead, store IDs in variables—such as merge-field URL parameters or a Get Records element—to make the Flow portable, maintainable, and flexible.",
      summary: "Hardcoded IDs break portability across environments",
      severity: "error",
      supportedTypes: ["Flow"], // Start with Flow only, extensible later
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
        {
          label: "Don't hard code Record Type IDs in Flow",
          path: "https://www.linkedin.com/feed/update/urn:li:activity:6947530300012826624/",
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
        const content =
          typeof element.content === "string"
            ? element.content
            : JSON.stringify(element.content);

        // Reset regex state for each element
        const regex = new RegExp(HardcodedId.SALESFORCE_ID_PATTERN);
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
      // Fall back to searching raw content
      const regex = new RegExp(HardcodedId.SALESFORCE_ID_PATTERN);
      const matches = file.content.match(regex);

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
