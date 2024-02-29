import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import flowfile from './testfiles/SOQLQueryInALoop_Demo_Fixed.json';

describe('In the SOQLQueryInALoop_Fixed Demo flow', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: './testfiles/SOQL_Query_In_Loop_Demo.flow',
      xmldata: flowfile,
    });
  });

  it('there should be no result for the rule SOQLQueryInLoop', ()                                                                            => {
    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });
});