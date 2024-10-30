import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

import { ParseFlows } from "../src/main/libs/ParseFlows";
import { ParsedFlow } from "../src/main/models/ParsedFlow";

import { UnconnectedElement } from "../src/main/rules/UnconnectedElement";

describe("UnconnectedElement", () => {
  let expect;
  before(async () => {
    expect = (await import("chai")).expect;
  });
  const unconnectedElementRule: UnconnectedElement = new UnconnectedElement();

  it("there should be checks for unconnected element", async () => {
    const connectedElementTestFile = path.join(
      __dirname,
      "./xmlfiles/Unconnected_Element.flow-meta.xml"
    );
    const parsed: ParsedFlow = (await ParseFlows([connectedElementTestFile])).pop() as ParsedFlow;
    const ruleResult: core.RuleResult = unconnectedElementRule.execute(parsed.flow as core.Flow);
    expect(ruleResult.occurs).to.be.true;
    expect(ruleResult.details).to.not.be.empty;
    ruleResult.details.forEach((detail) => {
      expect(detail.violation.name).to.equal("unused_assignment");
    });
  });

  it("async path there should be checks for unconnected element", async () => {
    const connectedElementTestFile = path.join(
      __dirname,
      "./xmlfiles/Unconnected_Element_Async.flow-meta.xml"
    );
    const parsed: ParsedFlow = (await ParseFlows([connectedElementTestFile])).pop() as ParsedFlow;
    const ruleResult: core.RuleResult = unconnectedElementRule.execute(parsed.flow as core.Flow);
    expect(ruleResult.occurs).to.be.true;
    ruleResult.details.forEach((ruleDetail) => {
      expect(ruleDetail.name).to.equal("UnconnectedElementTestOnAsync");
    });
  });

  it("should fix the unconnected element error", async () => {
    const connectedElementTestFile = path.join(
      __dirname,
      "./xmlfiles/Unconnected_Element.flow-meta.xml"
    );
    let flows = await core.parse([connectedElementTestFile]);
    const ruleConfig = {
      rules: {
        UnconnectedElement: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const fixedResults: core.ScanResult[] = core.fix(results);
    const fixedFlow: ParsedFlow = new ParsedFlow(connectedElementTestFile, fixedResults[0].flow);
    const newResults: core.ScanResult[] = core.scan([fixedFlow], ruleConfig);
    const fixedResultsOccurring = newResults[0].ruleResults.filter((rule) => rule.occurs);
    expect(fixedResultsOccurring.length).to.equal(0);
  });
});
