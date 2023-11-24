import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import dmlstatementsinaloop from './testfiles/DMLStatementInALoop_Demo_Fixed.json';

describe('In the DMLStatementInALoop_Demo_Fixed flow', () => {
  let flow: Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: './testfiles/DML_statements_in_a_loop_fixed.flow',
      xmldata: dmlstatementsinaloop,
    });
  });

  it('there should be no result for the rule DMLStatementInLoop', ()                                                                            => {

    const results: ScanResult[] = scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });
});