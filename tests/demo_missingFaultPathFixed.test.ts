import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import missingerrorhandler from './testfiles/missingerrorhandler_fixed.json';

describe('Demo Flow Missing_Error_Handler_Fixed', () => {
    let flow: core.Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new core.Flow({
            path: './testfiles/Missing_Error_Handler_Fixed.flow-meta.flow',
            xmldata: missingerrorhandler,
        });
    });

    it('Should have no result', () => {
        const results: core.ScanResult[] = core.scan([flow]);
        const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
        expect(occurringResults.length).to.equal(0);
    });
});