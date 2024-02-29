import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('When scanning a screen flow with 2 DML statements between screens and one marked as exception', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('DuplicateDMLOperation should have 1 result', () => {
    const ruleConfig = {
      rules: 
        { 
          DuplicateDMLOperation: 
                {
                    severity: 'error',
                },
        },
      exceptions: 
        {
            CreateANewAccountWithChild: 
                {"DuplicateDMLOperation":["ViewAccountId"]}
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(1);  });
});
