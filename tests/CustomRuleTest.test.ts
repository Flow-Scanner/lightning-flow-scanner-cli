import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';

describe('With a custom rule', () => {
    let flow: core.Flow;

    before('arrange', () => {
        flow = new core.Flow({
            path: './testfiles/****.flow-meta.xml',
            xmldata: Hidenav,
        });
    });

    it(' should have a result', () => {
        const ruleConfig = {
            rules:
            {
                FlowName:
                {
                    severity: 'error',
                    expression: '[A-Za-z0-9]'
                },
                FlowName2:
                {
                    severity: 'error',
                    path: '/Users/rubenhalman/Desktop/FlowName2.ts'
                }
            }
        };

        const results: core.ScanResult[] = core.scan([flow], ruleConfig);
        expect(results[0].ruleResults.length).to.equal(2);
        expect(results[0].ruleResults[0].occurs).to.equal(true);
        expect(results[0].ruleResults[1].occurs).to.equal(true);
    });
});
