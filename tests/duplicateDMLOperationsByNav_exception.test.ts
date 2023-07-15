import { assert, expect } from 'chai';
import 'mocha';
import { getRules, scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('When scanning a screen flow with 2 DML statements between screens and one marked as exception', () => {
  let flow: Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: 'anypath',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('DuplicateDMLOperationsByNavigation should have 1 result', () => {
    const ruleConfig = {
      rules: 
        { 
            DuplicateDMLOperationsByNavigation: 
                {
                    severity: 'error',
                },
        },
      exceptions: 
        {
            CreateANewAccountWithChild: 
                {"DuplicateDMLOperationsByNavigation":["ViewAccountId"]}
        }
    };

    const results: ScanResult[] = scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperationsByNavigation');
    expect(results[0].ruleResults[0].details.length).to.equal(1);  });
});
