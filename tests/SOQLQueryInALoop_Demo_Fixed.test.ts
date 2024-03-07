import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import flowfile from './testfiles/SOQLQueryInALoop_Demo_Fixed.json';
import { SOQLQueryInLoop } from '../src/main/rules/SOQLQueryInLoop';

describe('In the SOQLQueryInALoop_Fixed Demo flow', () => {
  let flow: core.Flow;
  
  it('there should be no result for the rule SOQLQueryInLoop', ()                                                                            => {
    
    flow = new core.Flow({
      path: './testfiles/SOQLQueryInALoop_Demo_Fixed.flow',
      xmldata: flowfile,
    });
    const rule = new SOQLQueryInLoop();
    const result = rule.execute(flow);
    expect(!result.occurs);
  });
});