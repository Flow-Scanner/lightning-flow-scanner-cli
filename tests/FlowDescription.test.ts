import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import missingFlowDescription from './testfiles/MissingFlowDescription_Demo.json';
import CreateANewAccount from './testfiles/CreateANewAccount.json';

describe('FlowDescription', () => {
  let flow: core.Flow;

  it(' should return a result when a flow is missing a description', () => {

    flow = new core.Flow({
        path: './testfiles/Missing_Flow_Description.flow',
        xmldata: missingFlowDescription,
      });
    const ruleConfig = {
      rules: 
        {
          FlowDescription: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan([flow]);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("FlowDescription");
  });

  it('FlowDescription should have no result', () => {
    flow = new core.Flow({
        path: 'anypath',
        xmldata: CreateANewAccount,
      });
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
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
