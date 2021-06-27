import {FlowElement} from "./FlowElement";
import {FlowVariable} from "./FlowVariable";

export class ScanResult {

  constructor(ruleName:string, results: (FlowElement[] | FlowVariable[] | boolean)) {
    this.ruleName = ruleName;
    this.results = results;
  }

  public ruleName: string;
  public results?: (FlowElement[] | FlowVariable[] | boolean);

}
