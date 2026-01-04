import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { Violation } from "./Violation";

export class RuleResult {
  public occurs: boolean;
  public ruleName: string;
  public ruleId: string;
  public ruleDefinition: IRuleDefinition;
  public severity: string;
  public details: Violation[] = [];
  public errorMessage: string;
  public message?: string; // Custom message that overrides the default rule description
  public messageUrl?: string; // URL to custom documentation (fallback to rule docs if not provided)

  constructor(info: IRuleDefinition, details: Violation[], errorMessage?: string) {
    this.ruleDefinition = info;
    this.ruleName = info.name;
    this.ruleId = info.ruleId;
    this.severity = info.severity ? info.severity : "warning";
    this.occurs = false;
    this.details = details;
    if (details.length > 0) {
      this.occurs = true;
    }
    if (errorMessage) {
      this.errorMessage = errorMessage;
    }
  }
}
