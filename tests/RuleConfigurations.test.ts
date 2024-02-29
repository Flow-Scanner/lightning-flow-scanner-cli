import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccount from './testfiles/CreateANewAccount.json';
import CreateANewAccountWithChild from './testfiles/CreateANewAccountWithChild.json';
import CreateANewAccountImproved from './testfiles/CreateANewAccountImproved.json';

describe('When scaning without specified rules in the rule config', () => {

  let flow: core.Flow;
  let flow2: core.Flow;
  let flows: core.Flow[];

  before('arrange', () => {
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccount,
    });
  });

  it('all default rules should be used when no configuration is provided', () => {

    const results: core.ScanResult[] = core.scan([flow], undefined);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });
  
  it('all default rules should be used when no rules are specified', () => {
    const ruleConfig = {
        rules: 
          { 
              
          },
        exceptions: 
          {
              CreateANewAccountWithChild: 
                  {"DuplicateDMLOperation":["ViewAccountId"]}
          }
      };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });

  it('incorrect rule severity configurations are defaulted', () => {
    const ruleConfig = {
        rules: 
          { 
            MissingNullHandler:
            {
                severity: 'errorr',
            }
          }
      };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(1);
  });


  it('incorrect rule configurations are skipped', () => {
    const ruleConfig = {
        rules: 
          { 
            MissingNullHandler:
            {
                severity: 'error',
            },
            MissingNullHandler2: 
            {
                severity: 'error',
            }
          },
        exceptions: 
          {
              CreateANewAccountWithChild: 
                  {"DuplicateDMLOperation":["ViewAccountId"]}
          }
      };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
  });

  before('arrange', () => {
    flow = new core.Flow({
      path: 'anypath',
      xmldata: CreateANewAccountWithChild,
    });
    flow2 = new core.Flow({
      path: 'anypath2',
      xmldata: CreateANewAccountImproved,
    });
    flows = [flow, flow2];
    });

    it('all should have results', () => {
      const ruleConfig = {
        rules:
        {
          DuplicateDMLOperation:
          {
            severity: 'error',
          },
          UnusedVariable:
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
              { "DuplicateDMLOperation": ["ViewAccountId", "ViewAccountId_0"] },
            CreateANewAccountImproved: 
              { "UnusedVariable": ["createAccount2"] }
          }
        };
      const results: core.ScanResult[] = core.scan(flows, ruleConfig);
      expect(results.length).to.equal(2);
    });

    it('In total there are currently 12 default rules', () => {
      const result = core.getRules();
      expect(result.length).to.equal(12);
    });

});
