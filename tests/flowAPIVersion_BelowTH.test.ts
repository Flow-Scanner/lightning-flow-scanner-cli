import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import Hidenav from './testfiles/api58test.json';

describe('A flow with the API version attribute below the configured threshold', () => {
  let flow: Flow;
  
  before('arrange', () => {
    flow = new Flow({
      path: './testfiles/api58test.flow-meta.xml',
      xmldata: Hidenav,
    });
  });

  it('should have a result', () => {
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error',
                    expression: '>55'
                },
        }
    };

    const results: ScanResult[] = scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });
});
