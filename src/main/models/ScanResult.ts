import Flow from './Flow';
import RuleResult from './RuleResult';

export default class ScanResult {

  constructor(flow: Flow, ruleResults: RuleResult[]) {
    this.flow = flow;
    this.ruleResults = ruleResults;
  }

  public flow: Flow;
  public ruleResults: RuleResult[];
}
