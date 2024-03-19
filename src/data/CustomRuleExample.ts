import { Flow, FlowAttribute, FlowType, IRuleDefinition, ResultDetails, RuleResult } from '/Users/rubenhalman/Projects/lightning-flow-scanner-core/src/index';

export class CustomNamingConvention implements IRuleDefinition{

  name: string;
  label: string;
  description: string;
  type:string;
  supportedTypes:string[];
  isConfigurable: boolean;
  docRefs: any;

  constructor(){
    this.name = 'CustomNamingConvention';
    this.label = 'Custom Naming Convention';
    this.description='custom execute function ';
    this.type = 'flow';
    this.supportedTypes = FlowType.allTypes();
    isConfigurable: true;
  }

  public execute(flow: Flow, options?: { expression: string }): RuleResult {

    const conventionApplied = (flow.name)?.startsWith('AcmeCorp_]');
    return (!conventionApplied ?
      new RuleResult(this, [new ResultDetails(new FlowAttribute(flow.name, 'name', 'The Name needs to start with AcmeCorp_'))]) :
      new RuleResult(this, []));
  }
}
