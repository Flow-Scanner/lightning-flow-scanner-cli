import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowNode } from '../models/FlowNode';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';

export class DuplicateDMLOperation extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'DuplicateDMLOperation',
      label: 'Duplicate DML Operation',
      description: "When the flow executes database changes or actions between two screens, it's important to prevent users from navigating back between screens. Failure to do so may result in duplicate database operations being performed within the flow.",
      type: 'pattern',
      supportedTypes: FlowType.visualTypes,
      docRefs: [],
      isConfigurable: false
    });
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, []);
    }
    const flowElements: FlowNode[] = flow.elements.filter(node => node instanceof FlowNode) as FlowNode[];
    const processedElementIndexes: number[] = [];
    const unconnectedElementIndexes: number[] = [];
    const DuplicateDMLOperations: FlowNode[] = [];
    const startingNode = this.findStart(flow);
    if (!startingNode || startingNode === -1) {
      throw 'Can not find starting element';
    }
    let dmlFlag = false;
    let indexesToProcess = [startingNode];
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
            dmlFlag = this.flagDML(element, dmlFlag);
            if (references.length > 0) {
              const elementsByReferences = flowElements.filter(element => references.includes(element.name));
              for (const nextElement of elementsByReferences) {
                const nextIndex = flowElements.findIndex(element => nextElement.name === element.name);
                if ('screens' === nextElement.subtype) {
                  if (dmlFlag && nextElement.element['allowBack'] && nextElement.element['allowBack'][0] == 'true' && nextElement.element['showFooter'][0] == 'true') {
                    DuplicateDMLOperations.push(nextElement);
                  }
                }
                if (!processedElementIndexes.includes(nextIndex)) {
                  indexesToProcess.push(nextIndex);
                }
              }
            }
            processedElementIndexes.push(index);
          }
        }
      } else {
        // skip unconnected elements
        for (const index of flowElements.keys()) {
          if (!processedElementIndexes.includes(index)) {
            unconnectedElementIndexes.push(index);
          }
        }
      }
    } while ((processedElementIndexes.length + unconnectedElementIndexes.length) < flowElements.length);

    let results = [];
    for (const det of DuplicateDMLOperations) {
      results.push(new ResultDetails(det));
    }
    return new RuleResult(this, results);
  }

  private flagDML(element, dmlFlag) {
    const dmlStatementTypes = ['recordDeletes', 'recordUpdates', 'recordCreates'];
    if (dmlStatementTypes.includes(element.subtype)) {
      return true;
    } else if (dmlFlag === true && element.subtype === 'screens' && element.element['allowBack'] && element.element['allowBack'][0] == 'true') {
      return false;
    } else {
      return dmlFlag;
    }
  }

  private findStart(flow: Flow) {
    const flowElements: FlowNode[] = flow.elements.filter(node => node instanceof FlowNode) as FlowNode[];
    let start;
    if (flow.startElementReference) {
      start = flowElements.findIndex(n => {
        return n.name == flow.startElementReference[0];
      });
    } else {
      start = flowElements.findIndex(n => {
        return n.subtype === 'start';
      });
    }
    return start;
  }

}
