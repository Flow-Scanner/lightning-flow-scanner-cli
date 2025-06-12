import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class CopyAPIName extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      name: "CopyAPIName",
      label: "Copy API Name",
      description:
        "Maintaining multiple elements with a similar name, like 'Copy_X_Of_Element,' can diminish the overall readability of your Flow. When copying and pasting these elements, it's crucial to remember to update the API name of the newly created copy.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: false,
      autoFixable: false,
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    const flowElements: core.FlowNode[] = flow.elements.filter(
      (node) => node instanceof core.FlowNode
    ) as core.FlowNode[];
    const copyOfElements = [];
    for (const element of flowElements) {
      // eslint-disable-next-line sonarjs/concise-regex
      const copyOf = new RegExp("Copy_[0-9]+_of_[A-Za-z0-9]+").test(element.name);
      if (copyOf) {
        copyOfElements.push(element);
      }
    }
    const results = [];
    for (const det of copyOfElements) {
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }
}
