import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountImproved from './testfiles/CreateANewAccountImproved.json';

describe('When scanning a flow without description', () => {
  let flow: Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: 'anypath',
      xmldata: CreateANewAccountImproved,
    });
  });

  it('MissingFlowDescription should have a result', () => {
    const ruleConfig = {
      rules: 
        {
          MissingFlowDescription: {
            severity: 'error',
          },
        },
    };

    const results: ScanResult[] = scan([flow], ruleConfig);

    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('MissingFlowDescription');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });
});
