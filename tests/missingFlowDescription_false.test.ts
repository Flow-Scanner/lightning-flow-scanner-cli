import {assert, expect} from 'chai';
import 'mocha';
import {getRules, scan} from '../src';
import {Flow} from '../src/main/models/Flow';
import {ScannerOptions} from '../src/main/models/ScannerOptions';
import {ScanResult} from '../src/main/models/ScanResult';
import CreateANewAccount = require('./testfiles/CreateANewAccount.json');

describe('When scanning a screen flow with 2 screens, a dml statements in between and no limits to navigation', () => {

  let flow;
  before('arrange', () => {

    // ARRANGE
    flow = new Flow({
      path: 'anypath',
      xmldata : CreateANewAccount
    });

  });
  it('DuplicateDMLOperationsByNavigation should have 2 results', () => {
    const results : ScanResult[] = scan([flow],  new ScannerOptions(['MissingFlowDescription']));
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('MissingFlowDescription');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
