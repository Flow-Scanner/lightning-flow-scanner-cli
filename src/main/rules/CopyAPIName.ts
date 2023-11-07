import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { FlowNode } from '../models/FlowNode';
import { ResultDetails } from '../models/ResultDetails';

export class CopyAPIName extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'CopyAPIName',
      label: 'Copy API Name',
      description: "Maintaining multiple elements with a similar name, like 'Copy_X_Of_Element,' can diminish the overall readability of your Flow. When copying and pasting these elements, it's crucial to remember to update the API name of the newly created copy.",
      type: 'pattern',
      supportedTypes: FlowType.allTypes(),
      docRefs: [],
      isConfigurable: false
    }
    );
  }

  public execute(flow: Flow): RuleResult {

    const flowElements: FlowNode[] = flow.elements.filter(node => node instanceof FlowNode) as FlowNode[];
    const copyOfElements = [];
    for (const element of flowElements) {
      const copyOf = new RegExp('Copy_[0-9]+_of_[A-Za-z0-9]+').test(element.name);
      if (copyOf) {
        copyOfElements.push(element);
      }
    }
    let results = [];
    for (const det of copyOfElements) {
      results.push(new ResultDetails(det));
    }
    return new RuleResult(this, results);
  }
}