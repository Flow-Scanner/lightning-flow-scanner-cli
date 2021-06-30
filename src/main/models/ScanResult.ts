import {Flow} from './Flow';
import {RuleResult} from './RuleResult';

export class ScanResult {

  constructor(flow: Flow, ruleResults: RuleResult[]) {
    this.flow = flow;
    this.ruleResults = ruleResults;

    let totalResults = 0;
    for(const ruleResult of ruleResults){
      totalResults = totalResults + ruleResult.resultCount;
    }
    this.resultCount = totalResults;
  }

  public flow: Flow;
  public ruleResults: RuleResult[];
  public resultCount: number;
}
