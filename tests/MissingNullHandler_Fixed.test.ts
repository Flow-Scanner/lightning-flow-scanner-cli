import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'

import CreateANewAccountWithChild from './testfiles/MissingNullHandler_Fixed.json';

describe('When scanning a flow with null handlers', () => {
    let flow: core.Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new core.Flow({
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
        const results: core.ScanResult[] = core.scan([flow], ruleConfig);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler')
        expect(results[0].ruleResults[0].occurs).to.equal(false);
    });
});
