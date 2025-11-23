import { RuleInfo } from "./RuleInfo";
import * as core from "../internals/internals";

export class RuleCommon {
  public autoFixable: boolean;
  public description: string;
  public docRefs: Array<{ label: string; path: string }> = [];
  public isConfigurable: boolean;
  public label: string;
  public name: string;
  public severity?: string;
  public supportedTypes: string[];
  public suppressionElement?: string;
  public uri?: string;

  constructor(
    info: RuleInfo,
    optional?: { severity?: string }
  ) {
    this.name = info.name;
    this.supportedTypes = info.supportedTypes;
    this.label = info.label;
    this.description = info.description;
    this.uri = `https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/main/src/main/rules/${info.name}.ts`;
    this.docRefs = info.docRefs;
    this.isConfigurable = info.isConfigurable;
    this.autoFixable = info.autoFixable;
    this.severity = optional?.severity ?? "error";
    this.suppressionElement = info.suppressionElement;
  }

  protected executeWithSuppression<T extends any[]>(
    flow: core.Flow,
    options: object | undefined,
    suppressions: string[],
    executeLogic: (suppSet: Set<string>) => core.RuleResult
  ): core.RuleResult {
    if (suppressions.includes("*")) {
      return new core.RuleResult(this as any, []);
    }
    const suppSet = new Set(suppressions);
    return executeLogic(suppSet);
  }
}