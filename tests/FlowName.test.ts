import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import * as path from 'path-browserify';

describe('FlowName', () => {
  let example_uri = path.join(__dirname, './xmlfiles/FlowNamingConvention.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Flow_Naming_Convention_Fixed.flow-meta.xml');

  it('should have a result when not in line with conventions', async () => {

    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: 
        { 
          FlowName: 
                {
                    severity: 'error',
                    expression: '[A-Za-z0-9]+_[A-Za-z0-9]+'
                },
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowName');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });

  it('should have no result when defined as exception', async () => {
    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: 
        { 
          FlowName: 
                {
                    severity: 'error',
                    expression: '[0-9]'
                },
        },
        exceptions: 
        {
            FlowNamingConvention: 
                {"FlowName":["FlowNamingConvention"]}
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('FlowName');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });

  it('should not have a result when in line with conventions', async () => {
    
    let flows = await core.parse([fixed_uri]);
    const ruleConfig = {
      rules: 
        { 
          FlowName: 
                {
                    severity: 'error',
                    expression: '[A-Za-z0-9]+_[A-Za-z0-9]+'
                },
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });
});
