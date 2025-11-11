import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class InactiveFlow extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      name: "InactiveFlow",
      label: "Inactive Flow",
      description:
        "Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble, like accidentally deleting records during testing, or being activated as subflows within parent flows.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: false,
      autoFixable: false, // TODO: make fixable
    });
  }

  public execute(
    flow: core.Flow,
    options?: object,
    suppressions: string[] = []
  ): core.RuleResult {
    const suppSet = new Set(suppressions);
    const results: core.ResultDetails[] = [];

    if (flow.status !== "Active") {
      if (!suppSet.has("InactiveFlow")) {
        results.push(
          new core.ResultDetails(
            new core.FlowAttribute(flow.status, "status", "!= Active")
          )
        );
      }
    }

    return new core.RuleResult(this, results);
  }
}