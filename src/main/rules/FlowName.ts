import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';

export class FlowName extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'FlowName',
      label: 'Flow Naming Convention',
      description: 'Readability of a flow is very important. Setting a naming convention for the Flow Name will improve the findability/searchability and overall consistency. It is recommended to at least provide a domain and a short description of the actions undertaken in the flow, in example Service_OrderFulfillment.',
      type: 'flow',
      supportedFlowTypes: FlowType.allTypes
    });
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {
    const regexExp = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    const conventionApplied = new RegExp(regexExp).test(flow.name);
    return new RuleResult(this, !conventionApplied, (!conventionApplied) ? ('The name ' + flow.name + ' does not meet the regex convention ' + regexExp) : undefined);
  }
}
