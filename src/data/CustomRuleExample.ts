import {
  Flow,
  FlowAttribute,
  FlowType,
  IRuleDefinition,
  ResultDetails,
  RuleResult,
} from "../main/internals/internals";

export class CustomNamingConvention implements IRuleDefinition {
  name: string;
  label: string;
  description: string;
  type: string;
  supportedTypes: string[];
  isConfigurable: boolean;
  autoFixable: boolean;
  docRefs: { label: string; path: string }[];

  constructor() {
    this.name = "CustomNamingConvention";
    this.label = "Custom Naming Convention";
    this.description = "custom execute function ";
    this.type = "flow";
    this.supportedTypes = FlowType.allTypes();
    this.isConfigurable = true;
    this.autoFixable = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(flow: Flow, options?: { expression: string }): RuleResult {
    const conventionApplied = flow.name?.startsWith("AcmeCorp_]");
    return !conventionApplied
      ? new RuleResult(this, [
          new ResultDetails(
            new FlowAttribute(flow.name as string, "name", "The Name needs to start with AcmeCorp_")
          ),
        ])
      : new RuleResult(this, []);
  }
}
