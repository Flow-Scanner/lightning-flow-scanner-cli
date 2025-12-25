import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class APIVersion extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "invalid-api-version",
      name: "APIVersion",
      label: "Invalid API Version",
      description:
        "Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
    });
  }

  protected check(
    flow: core.Flow,
    options: { expression?: string } | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    let flowAPIVersionNumber: number | null = null;
    if (flow.xmldata.apiVersion) {
      flowAPIVersionNumber = +flow.xmldata.apiVersion;
    }

    // Custom logic
    if (options?.expression) {
      // No API version with custom expression
      if (!flowAPIVersionNumber) {
        return [
          new core.Violation(
            new core.FlowAttribute("apiVersion<50", "apiVersion", "<50")
          )
        ];
      }

      // Match something like: >= 58
      const match = options.expression.match(/^\s*(>=|<=|>|<|===|!==)\s*(\d+)\s*$/);
      if (!match) {
        // Invalid expression format
        return [
          new core.Violation(
            new core.FlowAttribute(
              "Invalid API rule expression",
              "apiVersion",
              options.expression
            )
          )
        ];
      }
      const [, operator, versionStr] = match;
      const target = parseFloat(versionStr);
      let isValid = true;
      switch (operator) {
        case ">": isValid = flowAPIVersionNumber > target; break;
        case "<": isValid = flowAPIVersionNumber < target; break;
        case ">=": isValid = flowAPIVersionNumber >= target; break;
        case "<=": isValid = flowAPIVersionNumber <= target; break;
        case "===": isValid = flowAPIVersionNumber === target; break;
        case "!==": isValid = flowAPIVersionNumber !== target; break;
      }
      if (!isValid) {
        return [
          new core.Violation(
            new core.FlowAttribute(
              `${flowAPIVersionNumber}`,
              "apiVersion",
              options.expression
            )
          )
        ];
      }
    } else {
      // Default: no API version OR version below 50
      if (!flowAPIVersionNumber || flowAPIVersionNumber < 50) {
        return [
          new core.Violation(
            new core.FlowAttribute(
              flowAPIVersionNumber ? `${flowAPIVersionNumber}` : "apiVersion<50",
              "apiVersion",
              "<50"
            )
          )
        ];
      }
    }

    return [];
  }
}