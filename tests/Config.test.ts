import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import unconnectedElement from './testfiles/UnconnectedElement.json';
import Hidenav from './testfiles/hidenav.json';
import flawed from './testfiles/flawedflow.json';

describe('Rule Configurations ', () => {

  let flow2: core.Flow;

  it(' should use default when no configuration is provided', () => {
    flow2 = new core.Flow({
      path: './testfiles/unconnectedElement.flow-meta.xml',
      xmldata: unconnectedElement,
    });
    const results: core.ScanResult[] = core.scan([flow2], undefined);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });

  it(' should return errormessage when file seems corrupt', () => {
    flow2 = new core.Flow({
      path: './testfiles/flawed.flow-meta.xml',
      xmldata: flawed,
    });
    const results: core.ScanResult[] = core.scan([flow2], undefined);
    expect(results[0].ruleResults[0].errorMessage);
  });
  
  
  it(' should use default when no rules are specified', () => {
    flow2 = new core.Flow({
      path: './testfiles/unconnectedElement.flow-meta.xml',
      xmldata: unconnectedElement,
    });
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
    const results: core.ScanResult[] = core.scan([flow2], ruleConfig);
    const rules = core.getRules();
    expect(results[0].ruleResults.length).to.equal(rules.length);
  });

  it('incorrect rule severity configurations are defaulted', () => {
    flow2 = new core.Flow({
      path: './testfiles/unconnectedElement.flow-meta.xml',
      xmldata: unconnectedElement,
    });
    const ruleConfig = {
        rules: 
          { 
            MissingNullHandler:
            {
                severity: 'errorr',
            }
          }
      };
    const results: core.ScanResult[] = core.scan([flow2], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
  });


  it('incorrect rule configurations are skipped', () => {
    flow2 = new core.Flow({
      path: './testfiles/unconnectedElement.flow-meta.xml',
      xmldata: unconnectedElement,
    });
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
    const results: core.ScanResult[] = core.scan([flow2], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
  });

  it('Multiple Expressions are individually checked', () => {
    flow2 = new core.Flow({
      path: './testfiles/Async_OnlyTransaction.flow-meta.xml',
      xmldata: unconnectedElement,
    });
    const ruleConfig = {
        rules: {
          APIVersion: {
            severity: "error",
            expression: ">50",
          },
          CopyAPIName: {
            severity: "error",
          },
          DMLStatementInLoop: {
            severity: "error",
          },
          DuplicateDMLOperation: {
            severity: "error",
          },
          FlowDescription: {
            severity: "error",
          },
          FlowName: {
            severity: "error",
            expression: "[A-Za-z0-9]+_[A-Za-z0-9]+",
          },
          HardcodedId: {
            severity: "error",
          },
          MissingFaultPath: {
            severity: "error",
          },
          MissingNullHandler: {
            severity: "error",
          },
          SOQLQueryInLoop: {
            severity: "error",
          },
          UnconnectedElement: {
            severity: "error",
          },
          UnusedVariable: {
            severity: "error",
          },
        },
      };
    const results: core.ScanResult[] = core.scan([flow2], ruleConfig);
    expect(results[0].ruleResults.find((r) => r.ruleName === 'FlowName')?.occurs).to.equal(false);
  });

    it(' should give result', () => {
      flow2 = new core.Flow({
            path: './testfiles/NewAccountName.flow-meta.xml',
            xmldata: Hidenav,
        });
        const ruleConfig = {
            rules:
            {
                CustomNamingConvention:
                {
                    severity: 'error',
                    path: './src/data/CustomRuleExample.ts'
                }
            }
        };

        const results: core.ScanResult[] = core.scan([flow2], ruleConfig);
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });


});