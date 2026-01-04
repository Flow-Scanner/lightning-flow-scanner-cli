import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class FlowDescription extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "missing-flow-description",
      category: "layout",
      description: "Flow descriptions are essential for documentation and maintainability. Include a description for each Flow, explaining its purpose and where it's used.",
      summary: "Flow descriptions improve documentation and maintainability",
      docRefs: [],
      label: "Missing Flow Description",
      name: "FlowDescription",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
    }, { severity: "error" });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    if (flow.xmldata?.description) {
      return [];
    }

    return [
      new core.Violation(
        new core.FlowAttribute("undefined", "description", "!==null")
      )
    ];
  }
}