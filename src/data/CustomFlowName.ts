import { Flow, FlowAttribute, FlowType, IRuleDefinition, ResultDetails, RuleResult } from '/Users/rubenhalman/Projects/lightning-flow-scanner-core/src/index';

export class CustomFlowName implements IRuleDefinition{

  name: string;
  label: string;
  description: string;
  type:string;
  supportedTypes:string[];
  isConfigurable: boolean;
  docRefs: any;

  constructor(){
    this.name = 'FlowName';
    this.label = 'Naming Convention';
    this.description='New Description';
    this.type = 'flow';
    this.supportedTypes = FlowType.allTypes();
    isConfigurable: true;
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {
    const regexExp = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
    const conventionApplied = new RegExp(regexExp).test(flow.name);
    return (!conventionApplied ?
      new RuleResult(this, [new ResultDetails(new FlowAttribute(flow.name, 'name', regexExp))]) :
      new RuleResult(this, []));
  }
}
