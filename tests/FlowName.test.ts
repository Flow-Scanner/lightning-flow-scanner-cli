import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import unconnectedElement from './testfiles/UnconnectedElement.json';
import Hidenav from './testfiles/hidenav.json';
import FlowNamingConvention from './testfiles/FlowNamingConvention_Demo.json';

describe('FlowName', () => {
  let flow: core.Flow;

  it('should have no result', () => {

    flow = new core.Flow({
        path: './testfiles/Async_OnlyTransaction.flow-meta.xml',
        xmldata: unconnectedElement,
      });
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

  it('should have no result when defined as exception', () => {
    flow = new core.Flow({
        path: './testfiles/AAAA.flow-meta.xml',
        xmldata: Hidenav,
      });
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

  it('should have a result', () => {
    flow = new core.Flow({
        path: './testfiles/FlowNamingConvention.flow',
        xmldata: FlowNamingConvention,
      });
    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("FlowName");
  });
});
