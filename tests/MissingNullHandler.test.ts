import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccountWithChildFixed from './testfiles/MissingNullHandler_Fixed.json';
import CreateANewAccountWithChild from './testfiles/MissingNullHandler.json';
import cv from './testfiles/cv.json';
import taskbs from './testfiles/taskbs.json';

describe('MissingNullHandler ', () => {
    let flow: core.Flow;

    it(' should return a result when null handlers are implemented', () => {
        flow = new core.Flow({
            path: './testfiles/tc.flow-meta.xml',
            xmldata: CreateANewAccountWithChild,
        });
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
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });

    it(' should return no result when null handlers are implemented', () => {

        flow = new core.Flow({
            path: './testfiles/tc.flow-meta.xml',
            xmldata: CreateANewAccountWithChildFixed,
        });

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

    it('when opt XX ', () => {
        flow = new core.Flow({
            path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
            xmldata: cv,
        });

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

    it('When scustom variable assignments include null handlers', () => {

        flow = new core.Flow({
            path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
            xmldata: taskbs,
        });

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
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });
    
});
