import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import * as path from 'path-browserify';
  
describe('FlowDescription', () => {
  let example_uri = path.join(__dirname, './xmlfiles/Missing_Flow_Description.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Missing_Flow_Description_Fixed.flow-meta.xml');

  it('should return a result when missing a description', async () => {

    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: 
        {
          FlowDescription: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("FlowDescription");
  });

  it('should have no result when provided a description', async () => {

    let flows = await core.parse([fixed_uri]);
    const ruleConfig = {
      rules: 
        {
          FlowDescription: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);

    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowDescription');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
