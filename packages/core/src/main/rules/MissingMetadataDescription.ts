import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";

export class MissingMetadataDescription extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "missing-metadata-description",
      category: "layout",
      description: "Elements and metadata without a description reduce clarity and maintainability. Adding descriptions improves readability and makes your automation easier to understand.",
      summary: "Element descriptions improve clarity and maintainability",
      docRefs: [],
      label: "Missing Metadata Description",
      name: "MissingMetadataDescription",
      supportedTypes: core.FlowType.allTypes(),
    }, { severity: "warning" });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppression: Set<string>
  ): core.Violation[] {
    const violations: core.Violation[] = [];

    flow.elements
      .filter((elem) => {
        if (
          elem.metaType !== "attribute" &&
          !elem.element["description"] &&
          elem.subtype !== "start"
        ) {
          return elem;
        }
      })
      .forEach((elem) => {
        return violations.push(new core.Violation(elem));
      });

    return violations;
  }
}
