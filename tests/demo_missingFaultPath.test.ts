import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import missingerrorhandler from './testfiles/missingerrorhandler.json';

describe('In the Missing_error_handlers flow', () => {
  let flow: Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: './testfiles/Missing_error_handlers.flow-meta.flow',
      xmldata: missingerrorhandler,
    });
  });

  it('there should be one result for the rule MissingFaultPath', ()                                                                            => {

    const results: ScanResult[] = scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("MissingFaultPath");
  });
});