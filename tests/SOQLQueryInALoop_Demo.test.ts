import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import flowfile from './testfiles/SOQLQueryInALoop_Demo.json';
import { SOQLQueryInLoop } from '../src/main/rules/SOQLQueryInLoop';

describe('In the SOQLQueryInALoop Demo flow', () => {
  let flow: core.Flow;
  
  it('there should be one result for the rule SOQLQueryInLoop', ()                                                                            => {
    flow = new core.Flow({
      path: './testfiles/SOQL_Query_In_Loop_Demo.flow',
      xmldata: flowfile,
    });
    const rule = new SOQLQueryInLoop();
    const result = rule.execute(flow);
    expect(result.occurs);
  });
});