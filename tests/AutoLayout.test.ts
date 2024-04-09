import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';
import Api58 from './testfiles/api58test.json';

describe('Autolayout', () => {
  let flow: core.Flow;

  it(' should have a result when CanvasMode is set to FREE_FORM_CANVAS', () => {
    flow = new core.Flow({
        path: './testfiles/Hidenav.flow-meta.xml',
        xmldata: Hidenav,
      });
    const ruleConfig = {
      rules: 
        { 
          AutoLayout: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
    expect(occurringResults.find((res) => res.ruleName === 'AutoLayout'));

  });

  it('should not have result when autolayout is configured', () => {

    flow = new core.Flow({
      path: './testfiles/Api58.flow-meta.xml',
      xmldata: Api58,
    });
    
    const ruleConfig = {
      rules: 
        { 
            AutoLayout: 
                {
                    severity: 'error'
                },
        }
    };
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);

  });
});
