import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import dmlstatementsinaloop from './testfiles/DMLStatementInALoop_Demo.json';

describe('In the DMLStatementInALoop_Demo flow', () => {
  let flow: Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: './testfiles/DML_statements_in_a_loop.flow',
      xmldata: dmlstatementsinaloop,
    });
  });

  it('there should be one result for the rule DMLStatementInLoop', ()                                                                            => {

    const results: ScanResult[] = scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("DMLStatementInLoop");
  });
});