import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import SOQLQueryInALoop_Demo from './testfiles/SOQLQueryInALoop_Demo.json';
import SOQLQueryInALoop_Demo_Fixed from './testfiles/SOQLQueryInALoop_Demo_Fixed.json';

describe('SOQLQueryInLoop ', () => {
  let flow: core.Flow;
  
  it('there should be one result for the rule SOQLQueryInLoop', ()                                                                            => {
    flow = new core.Flow({
      path: './testfiles/SOQL_Query_In_Loop_Demo.flow',
      xmldata: SOQLQueryInALoop_Demo,
    });
    const results: core.ScanResult[] = core.scan([flow]);
    const SOQLQueryInLoop = results[0].ruleResults.find((rule) => rule.occurs && rule.ruleName === 'SOQLQueryInLoop');
    expect(SOQLQueryInLoop?.occurs).to.equal(true);
  });

  it('there should be no result for the rule SOQLQueryInLoop', ()                                                                            => {
    
    flow = new core.Flow({
      path: './testfiles/SOQLQueryInALoop_Demo_Fixed.flow',
      xmldata: SOQLQueryInALoop_Demo_Fixed,
    });
    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).not.include("SOQLQueryInLoop");
  });
});