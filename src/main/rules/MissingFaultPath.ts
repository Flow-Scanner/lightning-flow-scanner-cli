import * as rules from '../config/rules.json';
import {IRuleDefinition} from '../libs/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {RuleResult} from '../models/RuleResult';

export class MissingFaultPath implements IRuleDefinition {

  constructor() {
    const rule = rules.rules.find(rule => rule.name === 'DMLStatementInLoop');
    this.name = rule.name;
    this.label = rule.label;
    this.text = rule.text;
  }

  public name: string;
  public label: string;
  public text: string;

  public execute(flow: Flow) : RuleResult {

    const typesWithFaultPath = ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'];
    const flowElementsWhereFaultPathIsApplicable: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement && typesWithFaultPath.includes(node.subtype)) as FlowElement[];
    const elementsWithoutFaultPath: FlowElement[] = [];
    for (const element of flowElementsWhereFaultPathIsApplicable) {
      if (!element.connectors.find(connector => 'faultConnector' === connector.type)) {
        elementsWithoutFaultPath.push(element);
      }
    }
    return new RuleResult('MissingFaultPath', 'pattern', elementsWithoutFaultPath);
  }
}
