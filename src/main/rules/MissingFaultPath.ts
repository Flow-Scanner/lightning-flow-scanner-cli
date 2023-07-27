import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleCommon} from '../models/RuleCommon';
import { RuleDefinitions } from '../store/RuleDefinitions';

export class MissingFaultPath extends RuleCommon implements IRuleDefinition {

  constructor() {
    super(RuleDefinitions.MissingFaultPath, 'pattern', [...FlowType.backEndTypes, ...FlowType.visualTypes],[{label: 'Flow Best Practices', path:'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5'}]);
  }

  public execute(flow: Flow) : RuleResult {
    if(flow.type[0] === 'Survey'){
      return new RuleResult( false, this.name, this.type, this.severity, []);
    }
    const typesWithFaultPath = ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'];
    const flowElementsWhereFaultPathIsApplicable: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement && typesWithFaultPath.includes(node.subtype)) as FlowElement[];
    const elementsWithoutFaultPath: FlowElement[] = [];
    for (const element of flowElementsWhereFaultPathIsApplicable) {
      if (!element.connectors.find(connector => 'faultConnector' === connector.type)) {
        elementsWithoutFaultPath.push(element);
      }
    }
    return new RuleResult( elementsWithoutFaultPath.length > 0, this.name, this.type, this.severity, elementsWithoutFaultPath);
  }
}
