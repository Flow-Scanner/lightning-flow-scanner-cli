import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import obsolete from './testfiles/ObsoleteFlow_Demo.json';
import active from './testfiles/ActiveFlow_Demo.json';

describe('In the ObsoleteFlow flow', () => {
  let obsoleteflow, activeflow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    obsoleteflow = new core.Flow({
      path: './testfiles/ObsoleteFlow_Demo.flow',
      xmldata: obsolete,
    });
    activeflow = new core.Flow({
        path: './testfiles/ActiveFlow_Demo.flow',
        xmldata: active,
      });
  });

  it('there should be one result for the rule InactiveFlow', () => {

    const results: core.ScanResult[] = core.scan([obsoleteflow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("InactiveFlow");
  });

  it('there should be no results for an active flow', () => {

    const results: core.ScanResult[] = core.scan([activeflow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });
});