import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { FlowElement } from '../models/FlowElement';

export class CopyOf extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'CopyOf',
      label: 'Copy Of API Name',
      description: 'Having multiple elements called Copy_X_Of_Element will decrease the readability of the Flow. If you copy and paste them, make sure to update the API name of the new copy.',
      type: 'pattern',
      supportedFlowTypes: FlowType.allTypes
    }
    );
  }

  public execute(flow: Flow): RuleResult {
    
    const flowElements: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement) as FlowElement[];
    const copyOfElements = [];
      for (const element of flowElements) {
        const copyOf = new RegExp('Copy_[0-9]+_of_[A-Za-z0-9]+').test(element.name);
        if(copyOf){
          copyOfElements.push(element);
        }
      }
    return new RuleResult(this, copyOfElements.length > 0, copyOfElements);
  }
}