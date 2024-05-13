import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('DMLStatementInLoop ', () => {
  let example_uri = path.join(__dirname, './xmlfiles/DML_Statement_In_A_Loop.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Duplicate_DML_Operation_Fixed.flow-meta.xml');
  
  it('there should be one result for the rule DMLStatementInLoop', async ()                                                                            => {
    let flows = await core.parse([example_uri])
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("DMLStatementInLoop");
  });

  it('there should be no result for the rule DMLStatementInLoop', async ()                                                                            => {
    let flows = await core.parse([fixed_uri])
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });
});