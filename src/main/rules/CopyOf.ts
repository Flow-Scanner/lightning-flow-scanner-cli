import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { FlowNode } from '../models/FlowNode';
import { ResultDetails } from '../models/ResultDetails';

export class CopyOf extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'CopyOf',
      label: 'Copy Of API Name',
      description: 'Having multiple elements called Copy_X_Of_Element will decrease the readability of the Flow. If you copy and paste them, make sure to update the API name of the new copy.',
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
    return new RuleResult(this, copyOfElements.length > 0, results);
  }
}