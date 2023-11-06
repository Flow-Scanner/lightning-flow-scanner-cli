import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowNode } from '../models/FlowNode';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { ResultDetails } from '../models/ResultDetails';
import { Compiler } from '../libs/Compiler';

export class MissingFaultPath extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      name: 'MissingFaultPath',
      label: 'Missing error handlers',
      description: "At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path.",
      type: 'pattern',
      supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
      docRefs: [{ label: 'Flow Best Practices', path: 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
      isConfigurable: false,
    });
  }

  public execute(flow: Flow): RuleResult {
    if (flow.type[0] === 'Survey') {
      return new RuleResult(this, []);
    }

    const compiler = new Compiler();
    const results: ResultDetails[] = [];
    const elementsWhereFaultPathIsApplicable = (flow.elements.filter((node) => node instanceof FlowNode && ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'].includes(node.subtype)) as FlowNode[]).map((e) => e.name);

    const visitCallback = (element: FlowNode) => {
      // Check if the element should have a fault path
      if (!element.connectors.find((connector) => connector.type === 'faultConnector') && elementsWhereFaultPathIsApplicable.includes(element.name)) {
        // Check if the element is part of another fault path
        if (!this.isPartOfFaultHandlingFlow(element, flow)) {
          results.push(new ResultDetails(element));
        }
      }
    };

    // Use the Compiler for traversal
    compiler.traverseFlow(flow, flow.startReference, visitCallback);

    return new RuleResult(this, results);
  }

  private isPartOfFaultHandlingFlow(element: FlowNode, flow: Flow): boolean {
    const flowelements = flow.elements.filter(el => el instanceof FlowNode) as FlowNode[];
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
