import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import UnconnectedScreensWithDuplicateDML from './testfiles/UnconnectedScreensWithDuplicateDML.json';

describe('When scanning a screen flow with 2 screens, a DML statement in between, and limits in navigation of the later screen', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: 'anypath',
      xmldata: UnconnectedScreensWithDuplicateDML,
    });
  });

  it('DuplicateDMLOperation should have no result', () => {
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
    expect(results[0].ruleResults[0].details.length).to.equal(0);
  });
});
