import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'

import CreateANewAccountImproved from './testfiles/CreateANewAccountImproved.json';

describe('When scanning a flow without description', () => {
  let flow: core.Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: 'anypath',
      xmldata: CreateANewAccountImproved,
    });
  });

  it('FlowDescription should have a result', () => {
    const ruleConfig = {
      rules: 
        {
          FlowDescription: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);

    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowDescription');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });
});
