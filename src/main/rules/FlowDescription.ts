import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class FlowDescription extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      autoFixable: false,
      description:
        "Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.",
      docRefs: [],
      isConfigurable: false,
      label: "Missing Flow Description",
      name: "FlowDescription",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    const missingFlowDescription = !flow.xmldata?.description;
    return missingFlowDescription
      ? new core.RuleResult(this, [
          new core.ResultDetails(new core.FlowAttribute("undefined", "description", "!==null")),
        ])
      : new core.RuleResult(this, []);
  }
}
