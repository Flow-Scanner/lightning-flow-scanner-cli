import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('When scanning a screen flow with 2 DML statements between screens and both marked as exception', () => {
  let flow: Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('DuplicateDMLOperations should have 0 results', () => {
    const ruleConfig = {
      rules:
      {
        DuplicateDMLOperations:
        {
          severity: 'error',
        },
        FlowDescription:
        {
          severity: 'error',
        }
      }
      ,
      exceptions: 
        {
          CreateANewAccountWithChild: 
            { "DuplicateDMLOperations": ["ViewAccountId", "ViewAccountId_0"] }
        }
      };

    const results: ScanResult[] = scan([flow], ruleConfig);
    const ruleResult = results[0].ruleResults.find(
      (result) => result.ruleName === 'DuplicateDMLOperations'
    );
    expect(ruleResult?.occurs).to.be.false;

    const ruleResul2 = results[0].ruleResults.find(
      (result) => result.ruleName === 'FlowDescription'
    );
    expect(ruleResul2?.occurs).to.be.true;
  });
});
