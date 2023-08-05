import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/MissingNullHandler.json';

describe('When scanning a flow without null handlers', () => {
    let flow: Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new Flow({
            path: './testfiles/tc.flow-meta.xml',
            xmldata: CreateANewAccountWithChild,
        });
    });

    it('missing null handler should have a result', () => {
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
