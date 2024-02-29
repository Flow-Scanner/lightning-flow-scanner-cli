import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import CreateANewAccount from './testfiles/CreateANewAccount.json';

describe('When running with empty rule config', () => {
  let flow: core.Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: 'anypath',
      xmldata: CreateANewAccount,
    });
  });

  it('all default rules should be used', () => {

    const results: core.ScanResult[] = core.scan([flow], undefined);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });
});
