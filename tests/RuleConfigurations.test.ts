import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import unconnectedElement from './testfiles/UnconnectedElement.json';
import waitForOnly from './testfiles/WaitForOnly.json';

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

  it('In total there are currently 12 default rules', () => {
    const result = core.getRules();
    expect(result.length).to.equal(12);
  });

});
