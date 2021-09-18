import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../ruledefinitions/RuleDefinitions';
import {RuleCommon} from "./RuleCommon";

export class MissingFaultPath extends RuleCommon implements IRuleDefinition {

  constructor() {
    super(RuleDefinitions.MissingFaultPath, 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5');
  }


  public execute(flow: Flow) : RuleResult {

    const typesWithFaultPath = ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'];
    const flowElementsWhereFaultPathIsApplicable: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement && typesWithFaultPath.includes(node.subtype)) as FlowElement[];
    const elementsWithoutFaultPath: FlowElement[] = [];
    for (const element of flowElementsWhereFaultPathIsApplicable) {
      if (!element.connectors.find(connector => 'faultConnector' === connector.type)) {
        elementsWithoutFaultPath.push(element);
      }
    }
    return new RuleResult('MissingFaultPath', 'pattern', elementsWithoutFaultPath.length > 0, elementsWithoutFaultPath);
  }
}
