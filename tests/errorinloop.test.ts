import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import inlooperror from './testfiles/inlooperror.json';

describe('SOQLQueryInLoop ERROR ', () => {
    let flow: core.Flow;

    it(' should not occur', () => {

        flow = new core.Flow({
            path: 'anypath',
            xmldata: inlooperror,
        });
        const results: core.ScanResult[] = core.scan([flow]);
        console.log(results);
    });

});
