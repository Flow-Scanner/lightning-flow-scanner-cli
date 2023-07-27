import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('When scanning a screen flow with 2 DML statements between screens and one marked as exception', () => {
  let flow: Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('DuplicateDMLOperations should have 1 result', () => {
    const ruleConfig = {
      rules: 
        { 
          DuplicateDMLOperations: 
                {
                    severity: 'error',
                },
        },
      exceptions: 
        {
            CreateANewAccountWithChild: 
                {"DuplicateDMLOperations":["ViewAccountId"]}
        }
    };

    const results: ScanResult[] = scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperations');
    expect(results[0].ruleResults[0].details.length).to.equal(1);  });
});
