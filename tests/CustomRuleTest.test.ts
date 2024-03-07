import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import Hidenav from './testfiles/hidenav.json';

describe('A custom rule', () => {
    let flow: core.Flow;

    before('arrange', () => {
        flow = new core.Flow({
            path: './testfiles/****.flow-meta.xml',
            xmldata: Hidenav,
        });
    });

    it(' should be skipped for now without result', () => {
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
        expect(results[0].ruleResults.length).to.equal(1);
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });
});
