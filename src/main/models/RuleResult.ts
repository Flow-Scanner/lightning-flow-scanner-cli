import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { FlowElement } from './FlowElement';
import { FlowVariable } from './FlowVariable';

export class RuleResult {

  public occurs: boolean;
  public ruleName: string;
  public ruleLabel: string;
  public ruleDescription: string;
  public severity: string;
  public supportedFlowTypes: string[]
  public type: string;
  public details?: (FlowElement[] | FlowVariable[] | string);

  constructor(info: IRuleDefinition, occurs: boolean, details?: (FlowElement[] | FlowVariable[] | string)) {
    this.ruleName = info.name;
    this.ruleDescription = info.description;
    this.ruleLabel = info.label;
    this.supportedFlowTypes = info.supportedTypes;
    this.severity = info.severity ? info.severity : 'error';
    this.type = info.type;
    this.occurs = occurs;
    if (details) {
      this.details = details;
    }
  }

}
