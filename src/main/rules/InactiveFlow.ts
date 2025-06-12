import { AdvancedRule } from "../models/AdvancedRule";
import * as core from "../internals/internals";

export class InactiveFlow extends AdvancedRule implements core.IRuleDefinition {
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

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];
    if (flow.status !== "Active") {
      results.push(
        new core.ResultDetails(new core.FlowAttribute(flow.status, "status", "!= Active"))
      );
    }
    return new core.RuleResult(this, results);
  }
}
