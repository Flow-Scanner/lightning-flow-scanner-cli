import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { ResultDetails } from './ResultDetails';

export class RuleResult {

  public occurs: boolean;
  public ruleName: string;
  public ruleLabel: string;
  public ruleDescription: string;
  public severity: string;
  public supportedFlowTypes: string[]
  public type: string;
  public details: ResultDetails[] = [];

  constructor(info: IRuleDefinition, occurs: boolean, details?: ResultDetails[]) {
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
