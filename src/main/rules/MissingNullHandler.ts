import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import Flow from '../models/Flow';
import { FlowNode } from '../models/FlowNode';
import { FlowType } from '../models/FlowType';
import RuleResult from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';

export class MissingNullHandler extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'MissingNullHandler',
      label: 'Missing Null Handler',
      description: "When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result.",
      type: 'pattern',
      supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
      docRefs: [],
      isConfigurable: false
    });
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, []);
    }
    const getOperations = ['recordLookups'];
    const getOperationElements: FlowNode[] = flow.elements.filter(node => node.metaType === 'node' && getOperations.includes(node.subtype)) as FlowNode[];
    const decisionElements: FlowNode[] = flow.elements.filter(node => node.metaType === 'node' && node.subtype === 'decisions') as FlowNode[];
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
    let results = [];
    for (const det of getOperationsWithoutNullHandler) {
      results.push(new ResultDetails(det));
    }
    return new RuleResult(this, results);
  }
}
