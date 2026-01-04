import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
export class CopyAPIName extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "unclear-api-naming",
      name: "CopyAPIName",
      label: "Unclear API Name",
      description: "Elements with unclear or duplicated API names, like Copy_X_Of_Element, reduce Flow readability. Make sure to update the API name when copying elements to keep your Flow organized.",
      summary: "Duplicated API names reduce Flow readability",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
    });
  }
  protected check(
  flow: core.Flow
): core.Violation[] {
  const flowElements = flow.elements.filter(
    (node) => node instanceof core.FlowNode
  ) as core.FlowNode[];

  const copyOfElements = flowElements.filter(el =>
    /Copy_[0-9]+_of_[A-Za-z0-9]+/.test(el.name)
  );

  return copyOfElements.map(el => new core.Violation(el));
}

}