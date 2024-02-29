import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';

describe('A screen flow with a DML statements between where the screen after the DML hides the navigation', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: 'anypath',
      xmldata: Hidenav,
    });
  });

  it('DuplicateDMLOperation should have no result', () => {
    const ruleConfig = {
      rules: 
        { 
          DuplicateDMLOperation: 
                {
                    severity: 'error',
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
  });
});
