import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { Compiler, Flow, FlowNode, ResultDetails, RuleResult } from "../internals/internals";
import { RuleCommon } from "./RuleCommon";
import { RuleInfo } from "./RuleInfo";

export abstract class LoopRuleCommon extends RuleCommon implements IRuleDefinition {
  constructor(info: RuleInfo) {
    super(info);
  }

  public execute(flow: Flow, options?: object, suppressions: string[] = []): RuleResult {
    const suppSet = new Set(suppressions);
    const loopElements = this.findLoopElements(flow);
    if (!loopElements.length) {
      return new RuleResult(this, []);
    }
    const statementsInLoops = this.findStatementsInLoops(flow, loopElements);
    const results = statementsInLoops
      .filter(det => !suppSet.has(det.name))  // Early filter: O(1) per detail
      .map(det => new ResultDetails(det));
    return new RuleResult(this, results);
  }

  protected abstract getStatementTypes(): string[];

  private findLoopElements(flow: Flow): FlowNode[] {
    return (flow.elements?.filter((node) => node.subtype === "loops") as FlowNode[]) || [];
  }

  private findLoopEnd(element: FlowNode): string {
    return element.element["noMoreValuesConnector"]?.targetReference ?? element.name;
  }

  private findStatementsInLoops(flow: Flow, loopElements: FlowNode[]): FlowNode[] {
    const statementsInLoops: FlowNode[] = [];
    const statementTypes = this.getStatementTypes();
    const findStatement = (element: FlowNode) => {
      if (statementTypes.includes(element.subtype)) {
        statementsInLoops.push(element);
      }
    };
    for (const element of loopElements) {
      const loopEnd = this.findLoopEnd(element);
      // decide if we should count fault connectors as a violation
      // if (typeof element.element === "object" && "faultConnector" in (element.element as object)) {}
      new Compiler().traverseFlow(flow, element.name, findStatement, loopEnd);
    }
    return statementsInLoops;
  }
}