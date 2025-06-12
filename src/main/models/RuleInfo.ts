export class RuleInfo {
  public autoFixable: boolean;
  public description: string;
  public docRefs: Array<{ label: string; path: string }>;
  public isConfigurable: boolean;
  public label: string;
  public name: string;
  public supportedTypes: string[];
  public suppressionElement?: string;
}
