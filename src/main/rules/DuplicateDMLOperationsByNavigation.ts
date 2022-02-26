import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {RuleCommon} from './RuleCommon';

export class DuplicateDMLOperationsByNavigation extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.DuplicateDMLOperationsByNavigation, FlowType.visualTypes);
  }

  public execute(flow: Flow) : RuleResult {

    if(flow.type === 'Survey'){
      return new RuleResult( false, this.name, 'pattern');
    }
    const flowElements: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement) as FlowElement[];
    const processedElementIndexes: number[] = [];
    const unconnectedElementIndexes: number[] = [];
    const duplicateDMLOperationsByNavigation: FlowElement[] = [];
    const startingNode = this.findStart(flow);
    if(!startingNode || startingNode === -1) {
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
                if('screens' === nextElement.subtype){
                  if (dmlFlag && nextElement.element['allowBack'] && nextElement.element['allowBack'][0] == 'true'){
                    duplicateDMLOperationsByNavigation.push(nextElement);
                  }
                }
                if (!processedElementIndexes.includes(nextIndex)){
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
    return new RuleResult( duplicateDMLOperationsByNavigation.length > 0, this.name, 'pattern', duplicateDMLOperationsByNavigation);
  }

  private flagDML(element, dmlFlag) {
    const dmlStatementTypes = ['recordDeletes', 'recordUpdates', 'recordCreates'];
    if(dmlStatementTypes.includes(element.subtype)) {
      return true;
    } else if(dmlFlag === true && element.subtype === 'screens' && element.element['allowBack'] && element.element['allowBack'][0] == 'true'){
      return false;
    } else {
      return dmlFlag;
    }
  }

  private findStart(flow: Flow) {
    const flowElements: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement) as FlowElement[];
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
