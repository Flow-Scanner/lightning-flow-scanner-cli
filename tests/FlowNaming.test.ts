import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import unconnectedElement from './testfiles/UnconnectedElement.json';

describe('A flow with correct naming', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    flow = new core.Flow({
      path: './testfiles/Async_OnlyTransaction.flow-meta.xml',
      xmldata: unconnectedElement,
    });
  });

  it('should have no result', () => {
    const ruleConfig = {
      rules: 
        { 
          FlowName: 
                {
                    severity: 'error',
                    expression: '[A-Za-z0-9]+_[A-Za-z0-9]+'
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowName');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
