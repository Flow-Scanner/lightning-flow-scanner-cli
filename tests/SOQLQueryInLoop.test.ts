import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('SOQLQueryInLoop ', () => {
  let example_uri = path.join(__dirname, './xmlfiles/SOQL_Query_In_A_Loop.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/SOQL_Query_In_A_Loop_Fixed.flow-meta.xml');

  it('there should be one result for the rule SOQLQueryInLoop', async ()                                                                            => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const SOQLQueryInLoop = results[0].ruleResults.find((rule) => rule.occurs && rule.ruleName === 'SOQLQueryInLoop');
    expect(SOQLQueryInLoop?.occurs).to.equal(true);
  });

  it('there should be no result for the rule SOQLQueryInLoop', async ()                                                                            => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).not.include("SOQLQueryInLoop");
  });
});