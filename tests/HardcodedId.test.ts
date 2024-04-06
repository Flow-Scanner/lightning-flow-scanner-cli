import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import hardcodedids from './testfiles/HardcodedID_Demo.json';

describe('In the Hardcoded_Ids flow', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: './testfiles/Hardcoded_Ids.flow',
      xmldata: hardcodedids,
    });
  });

  it('there should be one result for the rule HardcodedIds', ()                                                                            => {

    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("HardcodedId");
  });
});