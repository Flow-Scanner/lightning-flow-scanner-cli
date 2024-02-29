import * as core from '../src'
import { expect } from 'chai';
import 'mocha';

describe('GetRuleDefinitions function', () => {
  it('should return 12 rules', () => {
    const result = core.getRules();
    expect(result.length).to.equal(12);
  });
});
