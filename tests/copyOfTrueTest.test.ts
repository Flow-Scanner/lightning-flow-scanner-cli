import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithCopy.json';

describe('In a normal flow without copied elements', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    // ARRANGE
    flow = new core.Flow({
      path: 'anypath',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('CopyAPIName should have no result', () => {
    const ruleConfig = {
      rules: 
        {
          CopyAPIName: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);

    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('CopyAPIName');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });
});
