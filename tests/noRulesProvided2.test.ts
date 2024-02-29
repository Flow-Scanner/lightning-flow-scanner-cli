import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccount from './testfiles/CreateANewAccount.json';

describe('When running with empty object rules in the rule config', () => {
  let flow: core.Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccount,
    });
  });
  

  it('all default rules should be used', () => {

    const ruleConfig = {
        rules: 
          { 
              
          },
        exceptions: 
          {
              CreateANewAccountWithChild: 
                  {"DuplicateDMLOperation":["ViewAccountId"]}
          }
      };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });
});
