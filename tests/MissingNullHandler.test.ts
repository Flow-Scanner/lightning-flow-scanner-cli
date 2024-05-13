import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import * as path from 'path-browserify';

describe('MissingNullHandler ', () => {
    let example_uri = path.join(__dirname, './xmlfiles/Missing_Null_Handler.flow-meta.xml');
    let fixed_uri = path.join(__dirname, './xmlfiles/Missing_Null_Handler_Fixed.flow-meta.xml');
  
    it('should return a result when no fault path is implemented', async () => {
        let flows = await core.parse([example_uri]);
        const ruleConfig = {
            rules:
            {
                MissingNullHandler:
                {
                    severity: 'error',
                },
            }
        };
        const results: core.ScanResult[] = core.scan(flows, ruleConfig);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler')
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });

    it(' should return no result when null handlers are implemented', async () => {

        let flows = await core.parse([fixed_uri]);
        const ruleConfig = {
            rules:
            {
                MissingNullHandler:
                {
                    severity: 'error',
                },
            }
        };
        const results: core.ScanResult[] = core.scan(flows, ruleConfig);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler')
        expect(results[0].ruleResults[0].occurs).to.equal(false);
    });
});
