import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('When scanning a screen flow with 2 screens, a DML statement in between, and no limits to navigation', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: 'anypath',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('DuplicateDMLOperation should have 2 results', () => {
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);

    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(2);
  });
});
