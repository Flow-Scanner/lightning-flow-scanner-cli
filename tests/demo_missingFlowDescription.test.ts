import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import missingFlowDescription from './testfiles/MissingFlowDescription_Demo.json';

describe('In the Missing_Flow_Description flow', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: './testfiles/Missing_Flow_Description.flow',
      xmldata: missingFlowDescription,
    });
  });

  it('there should be one result for the rule FlowDescription', ()                                                                            => {

    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("FlowDescription");
  });
});