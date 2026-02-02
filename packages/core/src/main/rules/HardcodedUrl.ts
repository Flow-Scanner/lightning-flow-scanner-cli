import { Flow, FlowType, Violation } from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { HardcodedUrl as RegexHardcodedUrl } from "@flow-scanner/regex-scanner";
import { toMetadataFile, toViolations } from "../config/RegexAdapter";

/**
 * Hardcoded Salesforce URL detection rule.
 * This is a wrapper around the regex-scanner's HardcodedUrl rule,
 * maintaining backward compatibility with the core scanner interface.
 */
export class HardcodedUrl extends RuleCommon implements IRuleDefinition {
  private regexRule = new RegexHardcodedUrl();

  constructor() {
    super(
      {
        ruleId: "hardcoded-url",
        category: "problem",
        description: "Avoid hard-coding URLs, as they may change between environments or over time. Instead, store URLs in variables or custom settings to make the Flow adaptable, maintainable, and environment-independent.",
        summary: "Hardcoded URLs break across different environments",
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
        label: "Hardcoded Url",
        name: "HardcodedUrl",
        supportedTypes: FlowType.allTypes(),
      },
      { severity: "error" }
    );
  }

  protected check(
    flow: Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): Violation[] {
    // Convert Flow to MetadataFile for regex-scanner
    const metadataFile = toMetadataFile(flow);

    // Execute regex rule
    const regexViolations = this.regexRule.execute(metadataFile);

    // Convert back to core Violations
    return toViolations(regexViolations);
  }
}
