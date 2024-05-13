import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('APIVersion', () => {
  let example_uri = path.join(__dirname, './xmlfiles/Outdated_API_Version.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Outdated_API_Version_Fixed.flow-meta.xml');

  it('should have a result when attribute is missing', async () => {

    let flows = await core.parse([example_uri])
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });

  it('should have a result when below configured threshold', async () => {
    let flows = await core.parse([example_uri])
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error',
                    expression: '>55'
                },
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });

  it('should have no result when version is meeting threshold', async () => {

    let flows = await core.parse([fixed_uri])
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
