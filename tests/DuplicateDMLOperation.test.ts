import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('DuplicateDMLOperation  ', () => {
  let example_uri = path.join(__dirname, './xmlfiles/Duplicate_DML_Operation.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Duplicate_DML_Operation_Fixed.flow-meta.xml');

  it('should have 1 result in a flow with a DML statement inbetween screens ', async () => {
    let flows = await core.parse([example_uri])

    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter(
      (rule) => rule.occurs
    );
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults[0].ruleName).to.equal("DuplicateDMLOperation");
  });
  
  it('should have no results in the fixed example', async () => {
    let flows = await core.parse([fixed_uri])

    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter(
      (rule) => rule.occurs
    );
    expect(occurringResults.length).to.equal(0);
  });

  
});

