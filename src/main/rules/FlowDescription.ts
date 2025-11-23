import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class FlowDescription extends RuleCommon implements IRuleDefinition {
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

  public execute(
    flow: core.Flow,
    options?: object,
    suppressions: string[] = []
  ): core.RuleResult {
    return this.executeWithSuppression(flow, options, suppressions, (suppSet) => {
      const missingFlowDescription = !flow.xmldata?.description;

      if (!missingFlowDescription || suppSet.has("FlowDescription")) {
        return new core.RuleResult(this, []);
      }

      const detail = new core.Violation(
        new core.FlowAttribute("undefined", "description", "!==null")
      );

      return new core.RuleResult(this, [detail]);
    });
  }
}