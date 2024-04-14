import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class MissingFaultPath extends RuleCommon implements core.IRuleDefinition {
  constructor() {
    super({
      name: 'MissingFaultPath',
      label: 'Missing Fault Path',
      description: "At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path.",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [{ label: 'Flow Best Practices', path: 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
      isConfigurable: false, 
      autoFixable: false
    });
  }

  public execute(flow: core.Flow): core.RuleResult {

    const compiler = new core.Compiler();
    const results: core.ResultDetails[] = [];
    const elementsWhereFaultPathIsApplicable = (flow.elements.filter((node) => node instanceof core.FlowNode && ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'].includes(node.subtype)) as core.FlowNode[]).map((e) => e.name);

    const visitCallback = (element: core.FlowNode) => {
      // Check if the element should have a fault path
      if (!element.connectors.find((connector) => connector.type === 'faultConnector') && elementsWhereFaultPathIsApplicable.includes(element.name)) {
        // Check if the element is part of another fault path
        if (!this.isPartOfFaultHandlingFlow(element, flow)) {
          results.push(new core.ResultDetails(element));
        }
      }
    };

    // Use the core.Compiler for traversal
    compiler.traverseFlow(flow, flow.startReference, visitCallback);

    return new core.RuleResult(this, results);
  }

  private isPartOfFaultHandlingFlow(element: core.FlowNode, flow: core.Flow): boolean {
    const flowelements = flow.elements.filter(el => el instanceof core.FlowNode) as core.FlowNode[];
    for (const otherElement of flowelements) {
      if (otherElement !== element) {
        // Check if the otherElement has a faultConnector pointing to element
        if (otherElement.connectors.find((connector) => connector.type === 'faultConnector' && connector.reference === element.name)) {
          return true;
        }
      }
    }
    return false;
  }
}
