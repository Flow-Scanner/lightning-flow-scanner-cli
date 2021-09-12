export class Override {
  public flowName: string;
  public rules: [any];

  constructor(flowName, rules){
    this.flowName = flowName;
    this.rules = rules;
  }
}
