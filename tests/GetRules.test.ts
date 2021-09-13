import {GetRules} from '../src';
import { expect } from 'chai';
import 'mocha';

describe('GetRuleDefinitions function', () => {
  it('should return 8 rules', () => {
    const result = GetRules();
    expect(result.length).to.equal(8);
  });
});
