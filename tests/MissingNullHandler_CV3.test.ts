import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'

import CreateANewAccountWithChild from './testfiles/cv.json';

describe('aaaaaaaa', () => {
    let flow: core.Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new core.Flow({
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

        const results: core.ScanResult[] = core.scan([flow], ruleConfig);
        expect(results[0].ruleResults.length).to.equal(1);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler');
        expect(results[0].ruleResults[0].occurs).to.equal(false);
    });
});
