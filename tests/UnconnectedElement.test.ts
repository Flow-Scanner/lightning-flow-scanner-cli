import { expect } from 'chai';
import 'mocha';
import * as core from '../src'
import unconnectedElement from './testfiles/UnconnectedElement.json';
import asyncAfterCommitOnly from './testfiles/AsyncAfterCommitOnly.json';
import waitForOnly from './testfiles/WaitForOnly.json';


describe('In the unconnected element flow', () => {
  let flow: core.Flow;
  
  it('there should be consideration for async elements', () => {
    flow = new core.Flow({
      path: './testfiles/Async_AfterCommitOnly.flow',
      xmldata: asyncAfterCommitOnly,
    });
    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

  it('there should consideration for async wait paths', () => {
    flow = new core.Flow({
      path: './testfiles/Async_AfterCommitOnly.flow',
      xmldata: waitForOnly,
    });
    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.find((res) => res.ruleName === 'UnconnectedElement'));
  });

  it('there should be checks for unconnected element', () => {
    flow = new core.Flow({
      path: './testfiles/Async_AfterCommitOnly.flow',
      xmldata: unconnectedElement,
    });
    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.find((res) => res.ruleName === 'UnconnectedElement'));
  });
});

