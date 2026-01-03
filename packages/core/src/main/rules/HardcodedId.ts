import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class HardcodedId extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "hardcoded-id",
      name: "HardcodedId",
      label: "Hardcoded Id",
      description: "Avoid hard-coding record IDs, as they are unique to a specific org and will not work in other environments. Instead, store IDs in variables—such as merge-field URL parameters or a **Get Records** element—to make the Flow portable, maintainable, and flexible.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
        {
          label: "Don't hard code Record Type IDs in Flow. By Stephen Church.",
          path: "https://www.linkedin.com/feed/update/urn:li:activity:6947530300012826624/",
        },
      ],
    }, { severity: "error" });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    const salesforceIdRegex = /\b[a-zA-Z0-9]{5}0[a-zA-Z0-9]{9}(?:[a-zA-Z0-9]{3})?\b/g;

    return flow.elements
      .filter((node) => salesforceIdRegex.test(JSON.stringify(node)))
      .map((node) => new core.Violation(node));
  }
}
