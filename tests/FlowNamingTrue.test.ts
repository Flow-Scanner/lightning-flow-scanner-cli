import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import Hidenav from './testfiles/hidenav.json';

describe('A flow with incorrect naming', () => {
  let flow: Flow;
  
  before('arrange', () => {
    flow = new Flow({
      path: './testfiles/****.flow-meta.xml',
      xmldata: Hidenav,
    });
  });

  it('should have a result', () => {
    const ruleConfig = {
      rules: 
        { 
          FlowNaming: 
                {
                    severity: 'error',
                    expression: '[A-Za-z0-9]'
                },
        }
    };

    const results: ScanResult[] = scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowNaming');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });
});
