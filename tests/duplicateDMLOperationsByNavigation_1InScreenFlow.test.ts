import { assert, expect } from 'chai';
import 'mocha';
import { getRules, scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import createANewAccount from './testfiles/CreateANewAccount.json';

describe('When scanning a screen flow with 2 screens, one DML statement in between, and no limits to navigation', () => {
  let flow: Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: 'anypath',
      xmldata: createANewAccount,
    });
  });

  it('DuplicateDMLOperationsByNavigation should have a result', () => {
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperationsByNavigation: {
            severity: 'error',
          },
        },
    };

    const results: ScanResult[] = scan([flow], ruleConfig);

    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperationsByNavigation');
    expect(results[0].ruleResults[0].details.length).to.equal(1);
  });
});
