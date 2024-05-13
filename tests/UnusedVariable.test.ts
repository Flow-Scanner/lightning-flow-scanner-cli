import { expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('UnusedVariable Rule', () => {
  let example_uri = path.join(__dirname, './xmlfiles/Unused_Variable.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Unused_Variable_Fixed.flow-meta.xml');

  it('there should be a result for unused variables', async () => {

    let flows = await core.parse([example_uri]);
    const ruleConfig = {
        rules:
        {
            UnusedVariable:
            {
                severity: 'error',
            },
        }
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
  });

  it('there should be no result for variables used in text elements', async () => {
    let flows = await core.parse([fixed_uri]);
    const ruleConfig = {
        rules:
        {
            UnusedVariable:
            {
                severity: 'error',
            },
        }
    };
  
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

});

