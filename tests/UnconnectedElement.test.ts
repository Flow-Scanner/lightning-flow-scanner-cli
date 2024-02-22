import { expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import unconnectedElement from './testfiles/UnconnectedElement.json';
import asyncAfterCommitOnly from './testfiles/AsyncAfterCommitOnly.json';
import waitForOnly from './testfiles/WaitForOnly.json';


describe('In the unconnected element flow', () => {
  let flow: Flow;
  
  it('there should be consideration for async elements', () => {
    flow = new Flow({
      path: './testfiles/Async_AfterCommitOnly.flow',
      xmldata: asyncAfterCommitOnly,
    });
    const results: ScanResult[] = scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

  it('there should consideration for async wait paths', () => {
    flow = new Flow({
      path: './testfiles/Async_AfterCommitOnly.flow',
      xmldata: waitForOnly,
    });
    const results: ScanResult[] = scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

  it('there should be checks for unconnected element', () => {
    flow = new Flow({
      path: './testfiles/Async_AfterCommitOnly.flow',
      xmldata: unconnectedElement,
    });
    const results: ScanResult[] = scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("UnconnectedElement");
  });
});

