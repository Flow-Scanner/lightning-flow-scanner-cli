import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowNode } from '../models/FlowNode';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';

export class MissingFaultPath extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'MissingFaultPath',
      label: 'Missing error handlers',
      description: 'Sometimes a flow doesn’t perform an operation that you configured it to do. By default, the flow shows an error message to the user and emails the admin who created the flow. However, you can control that behavior.',
      type: 'pattern',
      supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
      docRefs: [{ label: 'Flow Best Practices', path: 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
      isConfigurable: false
    }
    );
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, false);
    }
    const typesWithFaultPath = ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'];
    const flowElementsWhereFaultPathIsApplicable: FlowNode[] = flow.elements.filter(node => node instanceof FlowNode && typesWithFaultPath.includes(node.subtype)) as FlowNode[];
    const elementsWithoutFaultPath: FlowNode[] = [];
    for (const element of flowElementsWhereFaultPathIsApplicable) {
      if (!element.connectors.find(connector => 'faultConnector' === connector.type)) {
        elementsWithoutFaultPath.push(element);
      }
    }
    let results = [];
    for (const det of elementsWithoutFaultPath) {
      results.push(new ResultDetails(det));
    }
    return new RuleResult(this, elementsWithoutFaultPath.length > 0, results);
  }
}
