import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class FlowName extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'FlowName',
      label: 'Flow Naming Convention',
      description: "The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [{ 'label': "Naming your Flows is more critical than ever. By Stephen Church", 'path': 'https://www.linkedin.com/posts/stephen-n-church_naming-your-flows-this-is-more-critical-activity-7099733198175158274-1sPx?utm_source=share&utm_medium=member_desktop' }],
      isConfigurable: true, 
      autoFixable: false
    });
  }

  public execute(flow: core.Flow, options?: { expression: string }): core.RuleResult {
    const regexExp = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    const conventionApplied = new RegExp(regexExp).test(flow.name);
    return (!conventionApplied ?
      new core.RuleResult(this, [new core.ResultDetails(new core.FlowAttribute(flow.name, 'name', regexExp))]) :
      new core.RuleResult(this, []));
  }
}
