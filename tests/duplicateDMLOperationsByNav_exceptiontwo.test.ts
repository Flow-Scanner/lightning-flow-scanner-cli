import { assert, expect } from 'chai';
import 'mocha';
import { getRules, scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('When scanning a screen flow with 2 screens, a DML statement in between, and no limits to navigation', () => {
  let flow: Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: 'anypath',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('DuplicateDMLOperationsByNavigation should have 0 results', () => {
    const ruleConfig = {
      rules:
      {
        DuplicateDMLOperationsByNavigation:
        {
          severity: 'error',
        },
        MissingFlowDescription:
        {
          severity: 'error',
        }
      }
      ,
      exceptions: 
        {
          CreateANewAccountWithChild: 
            { "DuplicateDMLOperationsByNavigation": ["ViewAccountId", "ViewAccountId_0"] }
        }
      };

    const results: ScanResult[] = scan([flow], ruleConfig);
    const ruleResult = results[0].ruleResults.find(
      (result) => result.ruleName === 'DuplicateDMLOperationsByNavigation'
    );
    expect(ruleResult?.occurs).to.be.false;

    const ruleResul2 = results[0].ruleResults.find(
      (result) => result.ruleName === 'MissingFlowDescription'
    );
    expect(ruleResul2?.occurs).to.be.true;
  });
});
