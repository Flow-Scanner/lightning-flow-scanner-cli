import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';
import Api58 from './testfiles/api58test.json';

describe('APIVersion', () => {
  let flow: core.Flow;

  it(' should have a result when attribute is missing', () => {
    flow = new core.Flow({
        path: './testfiles/CreateANewAccount.flow-meta.xml',
        xmldata: Hidenav,
      });
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });

  it('should have a result when below configured threshold', () => {
    flow = new core.Flow({
        path: './testfiles/api58test.flow-meta.xml',
        xmldata: Api58,
      });
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error',
                    expression: '>55'
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(true);
  });

  it('should have no result when version is meeting threshold', () => {

    flow = new core.Flow({
      path: './testfiles/api58test.flow-meta.xml',
      xmldata: Api58,
    });
    
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
