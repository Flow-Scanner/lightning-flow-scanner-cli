import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import CreateANewAccountWithChild from './testfiles/cv.json';

describe('aaaaaaaa', () => {
    let flow: Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new Flow({
            path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
            xmldata: CreateANewAccountWithChild,
        });
    });

    it('bbbbbb', () => {
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
        expect(results[0].ruleResults.length).to.equal(1);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler');
        expect(results[0].ruleResults[0].occurs).to.equal(false);
    });
});
