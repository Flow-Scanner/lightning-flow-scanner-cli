import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class MissingNullHandler extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'MissingNullHandler',
      label: 'Missing Null Handler',
      description: "When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result.",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [],
      isConfigurable: false, 
      autoFixable: false
    });
  }

  public execute(flow: core.Flow): core.RuleResult {

    const getOperations = ['recordLookups'];
    const getOperationElements: core.FlowNode[] = flow.elements.filter(node => node.metaType === 'node' && getOperations.includes(node.subtype)) as core.FlowNode[];
    const decisionElements: core.FlowNode[] = flow.elements.filter(node => node.metaType === 'node' && node.subtype === 'decisions') as core.FlowNode[];
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
              let valueReference = condition.leftValueReference;
              for(let ref of resultReferences){
                referenceFound = ref.includes(valueReference);
                if(referenceFound){
                  break;
                }
              }
            }
            if (condition.operator && condition.operator.length > 0) {
              let operator = condition.operator;
              isNullOperator = (operator === 'IsNull');
            }
            if (condition.rightValue && condition.rightValue.length > 0 && condition.rightValue.booleanValue && condition.rightValue.booleanValue.length > 0) {
              let rightValue = condition.rightValue.booleanValue;
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
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }
}
