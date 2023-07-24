import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';
import CreateANewAccountImproved from './testfiles/CreateANewAccountImproved.json';

describe('When scanning multiple flows', () => {
    let flow: Flow;
    let flow2: Flow;
    let flows: Flow[];

    before('arrange', () => {
      // ARRANGE
      flow = new Flow({
        path: 'anypath',
        xmldata: CreateANewAccountWithChild,
      });
      flow2 = new Flow({
        path: 'anypath2',
        xmldata: CreateANewAccountImproved,
      });
      flows = [flow, flow2];
    });

  it('all should have results', () => {
    const ruleConfig = {
      rules:
      {
        DuplicateDMLOperations:
        {
          severity: 'error',
        },
        UnusedVariables:
        {
          severity: 'error',
        },
        MissingFlowDescription:
        {
          severity: 'error',
        }
      }
      ,
      exceptions: 
        {
          CreateANewAccountWithChild: 
            { "DuplicateDMLOperations": ["ViewAccountId", "ViewAccountId_0"] },
          CreateANewAccountImproved: 
            { "UnusedVariables": ["createAccount2"] }
        }
      };
    const results: ScanResult[] = scan(flows, ruleConfig);
    expect(results.length).to.equal(2);
  });
});
