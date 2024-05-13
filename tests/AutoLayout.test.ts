import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('Autolayout', () => {
  let example_uri = path.join(__dirname, './xmlfiles/Unconnected_Element.flow-meta.xml');
  let fixed_uri = path.join(__dirname, './xmlfiles/Outdated_API_Version_Fixed.flow-meta.xml');

  it('should have a result when CanvasMode is set to FREE_FORM_CANVAS', async () => {
    let flows = await core.parse([example_uri])
    const ruleConfig = {
      rules: 
        { 
          AutoLayout: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults.find((res) => res.ruleName === 'AutoLayout'));

  });

  it('should not have result when autolayout is configured', async () => {

    let flows = await core.parse([fixed_uri])
    const ruleConfig = {
      rules: 
        { 
            AutoLayout: 
                {
                    severity: 'error'
                },
        }
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);

  });
});
