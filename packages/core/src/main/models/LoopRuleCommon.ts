import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { Flow, FlowNode, Violation } from "../internals/internals";
import { RuleCommon } from "./RuleCommon";
import { RuleInfo } from "./RuleInfo";

export abstract class LoopRuleCommon extends RuleCommon implements IRuleDefinition {
  constructor(info: RuleInfo, optional?: { severity?: string }) {
    super(info, optional);
  }

  protected check(
    flow: Flow,
    _options: object | undefined,
    suppressions: Set<string>
  ): Violation[] {
    const loopElements = flow.graph.getLoopNodes();
    if (!loopElements.length) {
      return [];
    }
    const statementsInLoops = this.findStatementsInLoops(flow, loopElements);
    const results = statementsInLoops
      .filter(det => !suppressions.has(det.name))
      .map(det => new Violation(det));
    return results;
  }

  protected abstract getStatementTypes(): string[];

  private findLoopElements(flow: Flow): FlowNode[] {
    return flow.graph.getLoopNodes();
  }

  private findLoopEnd(element: FlowNode): string {
    return (element.element as any)?.noMoreValuesConnector?.targetReference ?? element.name;
  }

  private findStatementsInLoops(flow: Flow, loopElements: FlowNode[]): FlowNode[] {
    const statementsInLoops: FlowNode[] = [];
    const statementTypes = this.getStatementTypes();
    for (const element of loopElements) {
      const loopElems = flow.graph.getLoopElements(element.name);
      for (const elemName of loopElems) {
        const node = flow.graph.getNode(elemName);
        if (node && statementTypes.includes(node.subtype)) {
          statementsInLoops.push(node);
        }
      }
    }
    return statementsInLoops;
  }
}