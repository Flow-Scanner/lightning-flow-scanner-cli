import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';
import AssignTaskOwner from './testfiles/AssignTaskOwner.json';
import createANewAccount from './testfiles/CreateANewAccount.json';
import UnconnectedScreensWithDuplicateDML from './testfiles/UnconnectedScreensWithDuplicateDML.json';
import CreateANewAccountImproved from './testfiles/CreateANewAccountImproved.json';

describe('The DuplicateDMLOperation Rule ', () => {
  let flow: core.Flow;

  it('should have 1 result in a flow with a DML statement inbetween screens ', () => {
    flow = new core.Flow({
      path: 'anypath',
      xmldata: createANewAccount,
    });
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(1);
  });
  
  it('should have 2 results in a flow with 2 DML statements inbetween screens', () => {
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(2);
  });

  it('should have 1 result when 1 is specied as exception in a flow with 2 DML statements inbetween screens', () => {
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
    const ruleConfig = {
      rules: 
        { 
          DuplicateDMLOperation: 
                {
                    severity: 'error',
                },
        },
      exceptions: 
        {
            CreateANewAccountWithChild: 
                {"DuplicateDMLOperation":["ViewAccountId"]}
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(1);  
  });

  it('should have no results when all are specied as exception in a flow with 2 DML statements inbetween screens', () => {
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
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
  
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const ruleResult = results[0].ruleResults.find(
      (result) => result.ruleName === 'DuplicateDMLOperation'
    );
    expect(ruleResult?.occurs).to.be.false;
  
    const ruleResul2 = results[0].ruleResults.find(
      (result) => result.ruleName === 'FlowDescription'
    );
    expect(ruleResul2?.occurs).to.be.true;
  });

  it('should have no results in a random flow without screens', () => {
    flow = new core.Flow({
      path: 'anypath',
      xmldata: AssignTaskOwner,
    });
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
  
  it('should have no result in a flow with dmls and unconnected screens', () => {
    flow = new core.Flow({
      path: 'anypath',
      xmldata: UnconnectedScreensWithDuplicateDML,
    });
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(0);
  });

  it('should have no result when restrictions to the navigation are implemented', () => {
    flow = new core.Flow({
      path: 'anypath',
      xmldata: CreateANewAccountImproved,
    });
    const ruleConfig = {
      rules: 
        {
          DuplicateDMLOperation: {
            severity: 'error',
          },
        },
    };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('DuplicateDMLOperation');
    expect(results[0].ruleResults[0].details.length).to.equal(0);
  });
});

