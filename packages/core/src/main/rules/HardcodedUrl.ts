import { Flow, FlowType, Violation } from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class HardcodedUrl extends RuleCommon implements IRuleDefinition {
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
    if (!flow.elements || flow.elements.length === 0) return [];

    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}force\.com/g;

    return flow.elements
      .filter((element) => urlRegex.test(JSON.stringify(element)))
      .map((element) => new Violation(element));
  }
}
