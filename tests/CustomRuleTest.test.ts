import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';

describe('A custom rule', () => {
    let flow: core.Flow;

    it(' should give result', () => {
        flow = new core.Flow({
            path: './testfiles/CustomRuleExample.flow-meta.xml',
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

        const results: core.ScanResult[] = core.scan([flow], ruleConfig);
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });
});
