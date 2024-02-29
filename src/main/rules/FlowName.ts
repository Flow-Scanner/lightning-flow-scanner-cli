import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import Flow from '../models/Flow';
import { FlowType } from '../models/FlowType';
import RuleResult from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';
import { FlowAttribute } from '../models/FlowAttribute';
import { ResultDetails } from '../models/ResultDetails';

export class FlowName extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'FlowName',
      label: 'Flow Naming Convention',
      description: "The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'.",
      type: 'flow',
      supportedTypes: FlowType.allTypes(),
      docRefs: [{ 'label': "Naming your Flows is more critical than ever. By Stephen Church", 'path': 'https://www.linkedin.com/posts/stephen-n-church_naming-your-flows-this-is-more-critical-activity-7099733198175158274-1sPx?utm_source=share&utm_medium=member_desktop' }],
      isConfigurable: true
    });
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {
    const regexExp = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    const conventionApplied = new RegExp(regexExp).test(flow.name);
    return (!conventionApplied ?
      new RuleResult(this, [new ResultDetails(new FlowAttribute(flow.name, 'name', regexExp))]) :
      new RuleResult(this, []));
  }
}
