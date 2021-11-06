import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {RuleCommon} from "./RuleCommon";

export class DMLStatementInLoop extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.DMLStatementInLoop, [{'label': 'Flow Best Practices', 'path':'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5'}]);
  }

  public execute(flow: Flow) : RuleResult {

    const dmlStatementTypes = ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates'];
    const flowElements: FlowElement[] = flow.nodes.filter(node => node.nodeType === 'element') as FlowElement[];
    const loopElements: FlowElement[] = flow.nodes.filter(node => node.subtype === 'loops') as FlowElement[];
    const dmlInLoopIndexes: number[] = [];

    for (const loopElement of loopElements) {
      const startOfLoop = flowElements.findIndex(element => element.name === this.findStartOfLoopReference(loopElement));
      let reachedEndOfLoop = false;
      let indexesToProcess: number [] = [startOfLoop];
      const processedLoopElementIndexes: number[] = [];
      do {
        indexesToProcess = indexesToProcess.filter(index => !processedLoopElementIndexes.includes(index));
        if(indexesToProcess.length <= 0 || (indexesToProcess.length == 1 && indexesToProcess[0] == -1)){
          break;
        }
        for (const [index, element] of flowElements.entries()) {
          if (indexesToProcess.includes(index)) {
            const connectors = [];
            for (const connector of element.connectors) {
              if (connector.reference) {
                connectors.push(connector);
              }
            }
            if (dmlStatementTypes.includes(element.subtype)) {
              dmlInLoopIndexes.push(index);
            }
            if (connectors.length > 0) {
              const elementsByReferences = flowElements.filter(element => connectors.map(c => c.reference).includes(element.name));
              for (const nextElement of elementsByReferences) {
                const nextIndex = flowElements.findIndex(element => nextElement.name === element.name);
                if ('loops' === nextElement.subtype) {
                  reachedEndOfLoop = true;
                } else if (!processedLoopElementIndexes.includes(nextIndex)) {
                  indexesToProcess.push(nextIndex);
                }
              }
            }
            processedLoopElementIndexes.push(index);
          }
        }
      } while (reachedEndOfLoop === false);
    }

    const dmlStatementsInLoops: FlowElement[] = [];
    for (const [index, element] of flowElements.entries()) {
      if (dmlInLoopIndexes.includes(index)) {
        dmlStatementsInLoops.push(element);
      }
    }
    return new RuleResult('DMLStatementInLoop','pattern', dmlStatementsInLoops.length > 0, dmlStatementsInLoops);
  }

  private findStartOfLoopReference(loopElement: FlowElement) {
    return loopElement.connectors.find(el => el.type === 'nextValueConnector').reference;
  }
}
