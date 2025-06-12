import { AdvancedRule } from "../models/AdvancedRule";
import * as core from "../internals/internals";

export class DuplicateDMLOperation extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      name: "DuplicateDMLOperation",
      label: "Duplicate DML Operation",
      description:
        "When the flow executes database changes or actions between two screens, it's important to prevent users from navigating back between screens. Failure to do so may result in duplicate database operations being performed within the flow.",
      supportedTypes: core.FlowType.visualTypes,
      docRefs: [],
      isConfigurable: false,
      autoFixable: false,
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    const flowElements: core.FlowNode[] = flow.elements.filter(
      (node) => node instanceof core.FlowNode
    ) as core.FlowNode[];
    const processedElementIndexes: number[] = [];
    const unconnectedElementIndexes: number[] = [];
    const DuplicateDMLOperations: core.FlowNode[] = [];
    const startingNode = this.findStart(flow);
    if (!startingNode || startingNode === -1) {
      throw "Can not find starting element";
    }
    let dmlFlag = false;
    let indexesToProcess = [startingNode];
    do {
      indexesToProcess = indexesToProcess.filter(
        (index) => !processedElementIndexes.includes(index)
      );
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
              const elementsByReferences = flowElements.filter((element) =>
                references.includes(element.name)
              );
              for (const nextElement of elementsByReferences) {
                const nextIndex = flowElements.findIndex(
                  (element) => nextElement.name === element.name
                );
                if ("screens" === nextElement.subtype) {
                  if (
                    dmlFlag &&
                    nextElement.element["allowBack"] &&
                    nextElement.element["allowBack"] == "true" &&
                    nextElement.element["showFooter"] == "true"
                  ) {
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
    } while (
      processedElementIndexes.length + unconnectedElementIndexes.length <
      flowElements.length
    );

    const results = [];
    for (const det of DuplicateDMLOperations) {
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }

  private flagDML(element, dmlFlag) {
    const dmlStatementTypes = ["recordDeletes", "recordUpdates", "recordCreates"];
    if (dmlStatementTypes.includes(element.subtype)) {
      return true;
    } else if (
      dmlFlag === true &&
      element.subtype === "screens" &&
      element.element["allowBack"] &&
      element.element["allowBack"] == "true"
    ) {
      return false;
    } else {
      return dmlFlag;
    }
  }

  private findStart(flow: core.Flow) {
    const flowElements: core.FlowNode[] = flow.elements.filter(
      (node) => node instanceof core.FlowNode
    ) as core.FlowNode[];
    let start;
    if (flow.startElementReference) {
      start = flowElements.findIndex((n) => {
        return n.name == flow.startElementReference;
      });
    } else {
      start = flowElements.findIndex((n) => {
        return n.subtype === "start";
      });
    }
    return start;
  }
}
