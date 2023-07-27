import { RuleDefinitions } from "../store/RuleDefinitions";
import { RuleInfo } from "../store/RuleInfo";

export class RuleCommon{

  public label;
  public name;
  public severity;
  public uri;
  public docRefs:  {label: string, path: string}[] = [];
  public text: string;
  public supportedTypes: string[];
  public type: string;

  constructor(name:RuleDefinitions, type: string, supportedTypes:string[], docRefs? :  {label: string, path: string}[]){

    if(docRefs){
      this.docRefs = docRefs;
    }
    this.type = type;
    this.supportedTypes = supportedTypes;
    this.name = name;
    const rule = RuleInfo(name);
    this.label = rule.label;
    this.text = rule.text;
    this.severity = 'error';
    this.uri = 'https://github.com/Force-Config-Control/lightning-flow-scanner-core/tree/master/src/main/rules/' + name + '.ts';
  }
}
