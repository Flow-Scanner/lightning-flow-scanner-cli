import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

import { ParseFlows } from "../src/main/libs/ParseFlows";
import { ParsedFlow } from "../src/main/models/ParsedFlow";

import { UnsafeRunningContext } from "../src/main/rules/UnsafeRunningContext";

describe("UnsafeRunningContext", () => {
  let expect;
  before(async () => {
    expect = (await import("chai")).expect;
  });
  const unsafeRunningContext: UnsafeRunningContext = new UnsafeRunningContext();

  it("should have a scan result for without sharing system mode", async () => {
    const unsafeContextTestFile = path.join(
      __dirname,
      "./xmlfiles/Unsafe_Running_Context.flow-meta.xml"
    );
    const parsed: ParsedFlow = (await ParseFlows([unsafeContextTestFile])).pop() as ParsedFlow;
    const ruleResult: core.RuleResult = unsafeRunningContext.execute(parsed.flow as core.Flow);
    expect(ruleResult.occurs).to.be.true;
    expect(ruleResult.details).to.not.be.empty;
    expect(ruleResult.ruleDefinition.severity).to.be.equal("warning");
  });

  it("should not have a scan result for with sharing system mode", async () => {
    const unsafeContextTestFile = path.join(
      __dirname,
      "./xmlfiles/Unsafe_Running_Context_WithSharing.flow-meta.xml"
    );
    const parsed: ParsedFlow = (await ParseFlows([unsafeContextTestFile])).pop() as ParsedFlow;
    const ruleResult: core.RuleResult = unsafeRunningContext.execute(parsed.flow as core.Flow);
    expect(ruleResult.occurs).to.be.false;
    expect(ruleResult.details).to.be.empty;
  });

  it("should not have a scan result for default mode", async () => {
    const unsafeContextTestFile = path.join(
      __dirname,
      "./xmlfiles/Unsafe_Running_Context_Default.flow-meta.xml"
    );
    const parsed: ParsedFlow = (await ParseFlows([unsafeContextTestFile])).pop() as ParsedFlow;
    const ruleResult: core.RuleResult = unsafeRunningContext.execute(parsed.flow as core.Flow);
    expect(ruleResult.occurs).to.be.false;
    expect(ruleResult.details).to.be.empty;
  });
});
