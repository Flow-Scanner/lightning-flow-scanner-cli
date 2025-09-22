import { RuleInfo } from "./RuleInfo";

export class RuleCommon {
  public autoFixable: boolean;
  public description: string;
  public docRefs: Array<{ label: string; path: string }> = [];
  public isConfigurable: boolean;
  public label;
  public name;
  public severity?;
  public supportedTypes: string[];
  public suppressionElement?: string;
  public uri;

  constructor(
    info: RuleInfo,
    optional?: {
      severity?: string;
    }
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
}
