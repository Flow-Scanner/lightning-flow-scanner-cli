import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowNode} from '../models/FlowNode';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';
import { RuleDefinitions } from '../definitions/RuleDefinitions';

export class UnconnectedElements extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.UnconnectedElements, [...FlowType.backEndTypes, ...FlowType.visualTypes]);
  }

  public execute(flow: Flow) : RuleResult {
    if(flow.type[0] === 'Survey'){
      return new RuleResult( false, this.name, 'pattern', this.severity, []);
    }
    const flowElements: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement) as FlowElement[];
    let indexesToProcess = [this.findStart(flowElements)];
    const processedElementIndexes: number[] = [];
    const unconnectedElementIndexes: number[] = [];
    if(indexesToProcess[0] && indexesToProcess[0] === -1 && !flow.startElementReference) {
      throw 'Can not find starting element';
    }
    if (indexesToProcess[0] && indexesToProcess[0] === -1 && flow.startElementReference) {
      indexesToProcess = [
        flowElements.findIndex(n => {
          return n.name == flow.startElementReference[0];
        })
      ];
    }
    do {
        indexesToProcess = indexesToProcess.filter(index => !processedElementIndexes.includes(index));
        if (indexesToProcess.length > 0) {
          for (const [index, element] of flowElements.entries()) {
            if (indexesToProcess.includes(index)) {
              const references: string[] = [];
              if (element.connectors && element.connectors.length > 0) {
                for (const connector of element.connectors) {
                  if (connector.reference) {
                    references.push(connector.reference);
                  }
                }
              }
              if (references.length > 0) {
                const elementsByReferences = flowElements.filter(anElement => references.includes(anElement.name));
                for (const nextElement of elementsByReferences) {
                  const nextIndex = flowElements.findIndex(anElement => nextElement.name === anElement.name);
                  if (!processedElementIndexes.includes(nextIndex)) {
                    indexesToProcess.push(nextIndex);
                  }
                }
              }
              processedElementIndexes.push(index);
            }
          }
        } else {
          for (const index of flowElements.keys()) {
            if (!processedElementIndexes.includes(index)) {
              unconnectedElementIndexes.push(index);
            }
          }
        }
      } while ((processedElementIndexes.length + unconnectedElementIndexes.length) < flowElements.length);

    const processedElements = [];
    const unconnectedElements = [];
    for (const [index, element] of flowElements.entries()) {
      if (processedElementIndexes.includes(index)) {
        processedElements.push(element);
      } else if (unconnectedElementIndexes.includes(index)) {
        unconnectedElements.push(element);
      }
    }
    return new RuleResult( unconnectedElements.length > 0, this.name, 'pattern', this.severity, unconnectedElements);
  }

  private findStart(nodes: FlowNode[]) {
    return nodes.findIndex(n => {
      return n.subtype === 'start';
    });
  }


}
