import "mocha";
import * as core from "../src";
import * as path from "path-browserify";
import { ParsedFlow } from "../src/main/models/ParsedFlow";

describe("UnusedVariable Rule", () => {
  let expect;
  before(async () => {
    expect = (await import("chai")).expect;
  });
  let example_uri = path.join(__dirname, "./xmlfiles/Unused_Variable.flow-meta.xml");
  let fixed_uri = path.join(__dirname, "./xmlfiles/Unused_Variable_Fixed.flow-meta.xml");

  it("there should be a result for unused variables", async () => {
    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: {
        UnusedVariable: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(1);
  });

  it("there should be no result for variables used in text elements", async () => {
    let flows = await core.parse([fixed_uri]);
    const ruleConfig = {
      rules: {
        UnusedVariable: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

  it("should fix the unused variable error", async () => {
    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: {
        UnusedVariable: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const fixedResults: core.ScanResult[] = core.fix(results);
    const fixedFlow: ParsedFlow = new ParsedFlow(example_uri, fixedResults[0].flow);
    const newResults: core.ScanResult[] = core.scan([fixedFlow], ruleConfig);
    const fixedResultsOccurring = newResults[0].ruleResults.filter((rule) => rule.occurs);
    expect(fixedResultsOccurring.length).to.equal(0);
  });
});
