export class RuleCommon{

  public label;
  public name;
  public severity?;
  public uri;
  public docRefs:  {label: string, path: string}[] = [];
  public description: string;
  public supportedTypes: string[];
  public type: string;

  constructor(
    info: {
      "name": string, 
      "label": string,
      "description": string, 
      "type": string,
      "supportedFlowTypes": string[],
      "docRefs" :  {label: string, path: string}[],
    }, 
    optional?: {
      severity? : string,
    } 
  ){
    this.name = info.name;
    this.type = info.type;
    this.supportedTypes = info.supportedFlowTypes;
    this.label = info.label;
    this.description = info.description;
    this.uri = 'https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/' + info.name + '.ts';
    this.docRefs = info.docRefs;
    this.severity = (optional && optional.severity)? optional.severity : 'error';
  }
}
