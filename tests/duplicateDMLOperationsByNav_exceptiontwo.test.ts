import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';

describe('strange', () => {
  let flow: Flow;

  before('arrange', () => {
    // ARRANGE
    flow = new Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('error', () => {
    const ruleConfig = {
      rules:
      {
        DuplicateDMLOperation:
        {
          severity: 'error',
        },
        FlowDescription:
        {
          severity: 'error',
        }
      }
      ,
      exceptions: 
        {
          CreateANewAccountWithChild: 
            { "DuplicateDMLOperation": ["ViewAccountId", "ViewAccountId_0"] }
        }
      };

    const results: ScanResult[] = scan([flow], ruleConfig);
    const ruleResult = results[0].ruleResults.find(
      (result) => result.ruleName === 'DuplicateDMLOperation'
    );
    expect(ruleResult?.occurs).to.be.false;

    const ruleResul2 = results[0].ruleResults.find(
      (result) => result.ruleName === 'FlowDescription'
    );
    expect(ruleResul2?.occurs).to.be.true;
  });
});
