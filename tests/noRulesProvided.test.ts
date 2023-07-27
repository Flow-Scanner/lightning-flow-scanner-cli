import { assert, expect } from 'chai';
import 'mocha';
import { scan, getRules } from '../src';

import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccount from './testfiles/CreateANewAccount.json';

describe('When running with empty rule config', () => {
  let flow: Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: 'anypath',
      xmldata: CreateANewAccount,
    });
  });

  it('all default rules should be used', () => {

    const results: ScanResult[] = scan([flow], undefined);
    const rules = getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });
});
