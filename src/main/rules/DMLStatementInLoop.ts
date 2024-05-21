import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class DMLStatementInLoop extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'DMLStatementInLoop',
      label: 'DML Statement In A Loop',
      description: "To prevent exceeding Apex governor limits, it is advisable to consolidate all your database operations, including record creation, updates, or deletions, at the conclusion of the flow.",
      supportedTypes: core.FlowType.backEndTypes,
      docRefs: [{ 'label': 'Flow Best Practices', 'path': 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
      isConfigurable: false, 
      autoFixable: false
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    
    const dmlStatementTypes = ['recordDeletes', 'recordUpdates', 'recordCreates'];
    const loopElements: core.FlowNode[] = flow.elements.filter(node => node.subtype === 'loops') as core.FlowNode[];
    const dmlStatementsInLoops: core.FlowNode[] = [];

    const findDML = (element: core.FlowNode) => {
      if (dmlStatementTypes.includes(element.subtype)) {
        dmlStatementsInLoops.push(element);
      }
    };

    for (const element of loopElements) {
      let loopEnd: string | undefined;
      // Check if 'noMoreValuesConnector' attribute exists
      if (element.element['noMoreValuesConnector'] && element.element['noMoreValuesConnector']) {
        loopEnd = element.element['noMoreValuesConnector'].targetReference;
      } else {
        loopEnd = element.name;
      }
      new core.Compiler().traverseFlow(flow, element.name, findDML, loopEnd);
    }

    // Create result details
    const results = dmlStatementsInLoops.map(det => new core.ResultDetails(det));

    return new core.RuleResult(this, results);
  }

}
