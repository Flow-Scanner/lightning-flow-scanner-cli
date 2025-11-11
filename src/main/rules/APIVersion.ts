import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class APIVersion extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      name: "APIVersion",
      label: "Outdated API Version",
      description:
        "Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: true,
      autoFixable: false,
    });
  }

  public execute(flow: core.Flow, options?: { expression: string }, suppressions: string[] = []): core.RuleResult {
    const suppSet = new Set(suppressions);  // O(1) lookups
    let flowAPIVersionNumber: number | null = null;
    if (flow.xmldata.apiVersion) {
      flowAPIVersionNumber = +flow.xmldata.apiVersion;
    }
    const results: core.ResultDetails[] = [];
    if (!flowAPIVersionNumber) {
      const detail = new core.ResultDetails(new core.FlowAttribute("API Version <49", "apiVersion", "<49"));
      if (!suppSet.has(detail.name)) {  // Inline filter: skip if suppressed
        results.push(detail);
      }
      return new core.RuleResult(this, results);
    }
    if (options?.expression) {
      const isApiNumberMoreThanConfiguredExpression = new Function(
        `return ${flowAPIVersionNumber}${options.expression};`
      );
      if (!isApiNumberMoreThanConfiguredExpression()) {
        const detail = new core.ResultDetails(
          new core.FlowAttribute(`${flowAPIVersionNumber}`, "apiVersion", options.expression)
        );
        if (!suppSet.has(detail.name)) {  // Inline filter
          results.push(detail);
        }
      }
    }
    return new core.RuleResult(this, results);
  }
}