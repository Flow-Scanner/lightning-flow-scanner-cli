import {getRules} from '../src';
import { expect } from 'chai';
import 'mocha';

describe('GetRuleDefinitions function', () => {
  it('should return 11 rules', () => {
    const result = getRules();
    expect(result.length).to.equal(11);
  });
});
