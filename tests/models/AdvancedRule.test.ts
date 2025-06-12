import { describe, expect, it } from "@jest/globals";

import { AdvancedRule, Flow, ResultDetails, RuleResult } from "../../src";

class TestAdvancedRule extends AdvancedRule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(flow: Flow): RuleResult {
    const resultDetails: ResultDetails[] = [];
    return new RuleResult(this, resultDetails);
  }
}

describe("AdvancedRule", () => {
  it("should be defined", () => {
    expect(AdvancedRule).toBeDefined();
    expect(TestAdvancedRule).toBeDefined();
  });
});
