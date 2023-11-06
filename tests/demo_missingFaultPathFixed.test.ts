import { assert, expect } from 'chai';
import 'mocha';
import { scan } from '../src';
import { Flow } from '../src/main/models/Flow';
import { ScanResult } from '../src/main/models/ScanResult';
import missingerrorhandler from './testfiles/missingerrorhandler_fixed.json';

describe('Demo Flow Missing_Error_Handler_Fixed', () => {
    let flow: Flow;

    before('arrange', () => {
        // ARRANGE
        flow = new Flow({
            path: './testfiles/Missing_Error_Handler_Fixed.flow-meta.flow',
            xmldata: missingerrorhandler,
        });
    });

    it('Should have no result', () => {
        const results: ScanResult[] = scan([flow]);
        const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
        expect(occurringResults.length).to.equal(0);
    });
});