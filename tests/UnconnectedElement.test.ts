import { expect } from 'chai';
import 'mocha';
import * as core from '../src'
import * as path from 'path-browserify';

describe('UnconnectedElement', () => {
  let example_uri = path.join(__dirname, './xmlfiles/Unconnected_Element.flow-meta.xml');


  it('there should be checks for unconnected element', async () => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.find((res) => res.ruleName === 'UnconnectedElement'));
  });
});

