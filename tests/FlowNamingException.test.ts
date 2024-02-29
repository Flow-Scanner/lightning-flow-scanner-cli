import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';

describe('A flow with incorrect naming and set exception', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    flow = new core.Flow({
      path: './testfiles/AAAA.flow-meta.xml',
      xmldata: Hidenav,
    });
  });

  it('should have no result', () => {
    const ruleConfig = {
      rules: 
        { 
          FlowName: 
                {
                    severity: 'error',
                    expression: '[0-9]'
                },
        },
        exceptions: 
        {
            AAAA: 
                {"FlowName":["AAAA"]}
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowName');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
