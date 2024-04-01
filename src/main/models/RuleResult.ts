import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {ResultDetails} from './ResultDetails';

export class RuleResult {

  public occurs: boolean;
  public ruleName: string;
  public ruleDefinition: IRuleDefinition;
  public severity: string;
  public details: ResultDetails[] = [];

  constructor(info: IRuleDefinition, details: ResultDetails[]) {
    this.ruleDefinition = info;
    this.ruleName = info.name;
    this.severity = info.severity ? info.severity : 'error';
    this.occurs = false;
    this.details = details;
    if(details.length > 0){
      this.occurs = true;
    }
  }

}
