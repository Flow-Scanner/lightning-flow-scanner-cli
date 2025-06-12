import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class MissingNullHandler extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      autoFixable: false,
      description:
        "When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result.",
      docRefs: [],
      isConfigurable: false,
      label: "Missing Null Handler",
      name: "MissingNullHandler",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
    });
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public execute(flow: core.Flow): core.RuleResult {
    const getOperations = ["recordLookups"];
    const getOperationElements: core.FlowNode[] = flow.elements.filter(
      (node) => node.metaType === "node" && getOperations.includes(node.subtype)
    ) as core.FlowNode[];
    const decisionElements: core.FlowNode[] = flow.elements.filter(
      (node) => node.metaType === "node" && node.subtype === "decisions"
    ) as core.FlowNode[];
    const getOperationsWithoutNullHandler: core.FlowNode[] = [];
    for (const getElement of getOperationElements) {
      const elementName = getElement.name;
      let nullCheckFound = false;
      let resultReferences: string[] = [];
      if (getElement.element["storeOutputAutomatically"]) {
        resultReferences = [elementName];
      } else if (getElement.element["outputReference"]) {
        resultReferences = getElement.element["outputReference"];
      } else if (getElement.element["outputAssignments"]) {
        let outputAssignments = getElement.element["outputAssignments"];
        if (typeof outputAssignments !== "string") {
          if (typeof outputAssignments === "object") {
            outputAssignments = [outputAssignments];
          }
          for (const assignment of outputAssignments) {
            resultReferences.push(assignment.assignToReference);
          }
        }
      }
      for (const el of decisionElements) {
        let rules = el.element["rules"];
        if (typeof rules === "string") {
          continue;
        }
        if (typeof rules === "object") {
          rules = [rules];
        }
        for (const rule of rules as object[]) {
          if (!("conditions" in rule)) {
            continue;
          }
          let maybeArray = rule.conditions;
          if (typeof rule.conditions === "object") {
            maybeArray = [rule.conditions];
          }
          for (const condition of maybeArray as object[]) {
            let referenceFound: boolean = false;
            let isNullOperator: boolean = false;
            let checksIfFalse: boolean = false;
            if (
              "leftValueReference" in condition &&
              typeof condition.leftValueReference === "string" &&
              condition.leftValueReference.length > 0
            ) {
              const valueReference = condition.leftValueReference;
              for (const ref of resultReferences) {
                referenceFound = ref.includes(valueReference);
                if (referenceFound) {
                  break;
                }
              }
            }
            if (
              "operator" in condition &&
              typeof condition.operator === "string" &&
              condition.operator.length > 0
            ) {
              const operator = condition.operator;
              isNullOperator = operator === "IsNull";
            }
            if (
              "rightValue" in condition &&
              typeof condition.rightValue === "object" &&
              condition.rightValue &&
              "booleanValue" in condition.rightValue &&
              typeof condition.rightValue.booleanValue === "string"
            ) {
              const rightValue = condition.rightValue.booleanValue;
              checksIfFalse = rightValue.toLowerCase() === "false";
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
    const results: core.ResultDetails[] = [];
    for (const det of getOperationsWithoutNullHandler) {
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }
}
