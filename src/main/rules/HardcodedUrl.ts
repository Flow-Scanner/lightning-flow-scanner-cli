import { Flow, FlowType, IRuleDefinition, ResultDetails, RuleResult } from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class HardcodedUrl extends AdvancedRule implements IRuleDefinition {
  constructor() {
    super(
      {
        autoFixable: false,
        description:
          "Avoid hard-coding URLs as they are org-specific. Instead, use a $API formula (preferred) or you can use an environment-specific such as custom labels, custom metadata, or custom settings.",
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
        label: "Hardcoded Url",
        name: "HardcodedUrl",
        supportedTypes: FlowType.allTypes(),
      },
      {
        severity: "warning",
      }
    );
  }

  public execute(flow: Flow): RuleResult {
    const results: ResultDetails[] = [];

    if (!flow.elements || flow.elements.length === 0) {
      return new RuleResult(this, results);
    }

    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}force\.com/g;

    for (const element of flow.elements) {
      const nodeString = JSON.stringify(element);
      if (urlRegex.test(nodeString)) {
        results.push(new ResultDetails(element));
      }
    }

    return new RuleResult(this, results);
  }
}
