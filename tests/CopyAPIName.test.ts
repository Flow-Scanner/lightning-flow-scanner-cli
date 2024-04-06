import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';
import CreateANewAccountWithCopy from './testfiles/CreateANewAccountWithCopy.json';

describe('CopyAPIName ', () => {
  let flow: core.Flow;

  it('CopyAPIName should have no result', () => {
    flow = new core.Flow({
        path: 'anypath',
        xmldata: CreateANewAccountWithChild,
      });
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
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });

  it('CopyAPIName should have no result', () => {
    flow = new core.Flow({
        path: 'anypath',
        xmldata: CreateANewAccountWithCopy,
      });
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