import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowElement } from '../models/FlowElement';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';

export class MissingNullHandler extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'MissingNullHandler',
      label: 'Missing null handlers',
      description: 'If a Get Records operation does not find any data it will return null. Use a decision element on the operation result variable to validate that the result is not null.',
      type: 'pattern',
      supportedFlowTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes]
    });
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, false);
    }
    const getOperations = ['recordLookups'];
    const getOperationElements: FlowElement[] = flow.nodes.filter(node => node.nodeType === 'element' && getOperations.includes(node.subtype)) as FlowElement[];
    const decisionElements: FlowElement[] = flow.nodes.filter(node => node.nodeType === 'element' && node.subtype === 'decisions') as FlowElement[];
    const getOperationsWithoutNullHandler = [];
    for (const getElement of getOperationElements) {
      const elementName = getElement.name;
      let nullCheckFound = false;
      let resultReferences = [];
      if (getElement.element['storeOutputAutomatically']) {
        resultReferences = [elementName];
      } else if(getElement.element['outputReference']){
        resultReferences = getElement.element['outputReference'];
      } else if(getElement.element['outputAssignments']) {
        const outputAssignments = getElement.element['outputAssignments'];
        for (const assignment of outputAssignments) {
          resultReferences.push(assignment.assignToReference)
        }
      }
      for (const el of decisionElements) {
        const rules = el.element['rules'];
        for (const rule of rules) {
          for (const condition of rule.conditions) {
            let referenceFound: boolean = false;
            let isNullOperator: boolean = false;
            let checksIfFalse: boolean = false;
            if (condition.leftValueReference && condition.leftValueReference.length > 0) {
              let valueReference = condition.leftValueReference[0];
              for(let ref of resultReferences){
                referenceFound = ref.includes(valueReference);
                if(referenceFound){
                  break;
                }
              }
            }
            if (condition.operator && condition.operator.length > 0) {
              let operator = condition.operator[0];
              isNullOperator = (operator === 'IsNull');
            }
            if (condition.rightValue && condition.rightValue.length > 0 && condition.rightValue[0].booleanValue && condition.rightValue[0].booleanValue.length > 0) {
              let rightValue = condition.rightValue[0].booleanValue[0];
              checksIfFalse = (rightValue.toLowerCase() === 'false');
            }
            if (referenceFound && isNullOperator && checksIfFalse) {
              nullCheckFound = true;
            }
          }
        }
      }
      if (!nullCheckFound) {
        getOperationsWithoutNullHandler.push(getElement);
      }
    }
    return new RuleResult(this, getOperationsWithoutNullHandler.length > 0, getOperationsWithoutNullHandler);
  }
}
