import { expect } from 'chai';
import 'mocha';
import * as core from '../src'
import SendEmailFlow from './testfiles/SendEmailFlow.json';
import unusedvariable from './testfiles/unusedvariable.json';

describe('UnusedVariable Rule', () => {
  let flow: core.Flow;
  

  it('there should be a result for unused variables', () => {
    const ruleConfig = {
        rules:
        {
            UnusedVariable:
            {
                severity: 'error',
            },
        }
    };
    flow = new core.Flow({
      path: './testfiles/UnusedVariable.flow',
      xmldata: unusedvariable,
    });
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
  });

  it('there should be no result for variables used in text elements', () => {
    const ruleConfig = {
        rules:
        {
            UnusedVariable:
            {
                severity: 'error',
            },
        }
    };
    flow = new core.Flow({
      path: './testfiles/SendEmailFlow.flow',
      xmldata: SendEmailFlow,
    });
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

});

