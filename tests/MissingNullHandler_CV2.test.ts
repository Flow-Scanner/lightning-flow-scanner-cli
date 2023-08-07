import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/taskbs.json';

describe('When scanning a flow with custom variable assignments in queries that have null handlers', () => {
    let flow: Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new Flow({
            path: './testfiles/tc.flow-meta.xml',
            xmldata: CreateANewAccountWithChild,
        });
    });

    it('missing null handler should have no result', () => {
        const ruleConfig = {
            rules:
            {
                MissingNullHandler:
                {
                    severity: 'error',
                },
            }
        };
        const results: ScanResult[] = scan([flow], ruleConfig);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler')
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });
});
