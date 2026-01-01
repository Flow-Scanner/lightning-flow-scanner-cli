import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class FlowDescription extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "missing-flow-description",
      description: "Descriptions play a vital role in documentation. It is highly recommended to include details about where a flow is used and its intended purpose.",
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