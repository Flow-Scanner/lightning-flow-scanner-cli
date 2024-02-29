import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import FlowNamingConvention from './testfiles/FlowNamingConvention_Demo.json';

describe('In the FlowNamingConvention flow', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: './testfiles/FlowNamingConvention.flow',
      xmldata: FlowNamingConvention,
    });
  });

  it('there should be one result for the rule FlowName', ()                                                                            => {

    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("FlowName");
  });
});