import { RuleCommon } from "../models/RuleCommon";
import * as core from "../internals/internals";

export class CyclomaticComplexity extends RuleCommon implements core.IRuleDefinition {
  constructor() {
    super({
      name: "CyclomaticComplexity",
      label: "Cyclomatic Complexity",
      description:
        "The number of loops and decision rules, plus the number of decisions. Use subflows to reduce the cyclomatic complexity within a single flow, ensuring maintainability and simplicity.",
      supportedTypes: core.FlowType.backEndTypes,
      docRefs: [],
      isConfigurable: true,
      autoFixable: false,
    });
  }

  public execute(flow: core.Flow, options?: { threshold: string }): core.RuleResult {
    // Set Threshold
    let threshold = 0;

    if (options && options.threshold) {
      threshold = +options.threshold;
    } else {
      threshold = 25;
    }

    // Calculate Cyclomatic Complexity based on the number of decision rules and loops, adding the number of decisions plus 1.
    let cyclomaticComplexity = 1;

    const flowDecisions = flow.elements.filter((node) => node.subtype === "decisions");
    const flowLoops = flow.elements.filter((node) => node.subtype === "loops");

    for (const decision of flowDecisions) {
      const rules = decision.element["rules"];
      if (Array.isArray(rules)) {
        cyclomaticComplexity += rules.length + 1;
      } else {
        cyclomaticComplexity += 1;
      }
    }
    if (flowLoops && flowLoops.length > 0) {
      cyclomaticComplexity += flowLoops.length;
    }

    const results: core.ResultDetails[] = [];
    if (cyclomaticComplexity > threshold) {
      results.push(
        new core.ResultDetails(
          new core.FlowAttribute("" + cyclomaticComplexity, "CyclomaticComplexity", ">" + threshold)
        )
      );
    }
    return new core.RuleResult(this, results);
  }
}
