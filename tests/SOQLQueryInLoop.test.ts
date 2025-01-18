import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

describe("SOQLQueryInLoop ", () => {
  let expect;
  beforeAll(async () => {
    expect = (await import("chai")).expect;
  });
  let example_uri = path.join(__dirname, "./xmlfiles/SOQL_Query_In_A_Loop.flow-meta.xml");

  it("there should be one result for the rule SOQLQueryInLoop", async () => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const SOQLQueryInLoop = results[0].ruleResults.find(
      (rule) => rule.occurs && rule.ruleName === "SOQLQueryInLoop"
    );
    expect(SOQLQueryInLoop?.occurs).toBe(true);
  });

  it("there should be no result for the rule SOQLQueryInLoop", async () => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toEqual(expect.not.arrayContaining(["SOQLQueryInLoop"]));
  });
});
