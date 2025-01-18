import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

describe("HardcodedId", () => {
  let expect;
  beforeAll(async () => {
    expect = (await import("chai")).expect;
  });
  let example_uri = path.join(__dirname, "./xmlfiles/Hardcoded_Id.flow-meta.xml");

  it("there should be one result for the rule HardcodedIds", async () => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).toBe(1);
    expect(occurringResults[0].ruleName).toBe("HardcodedId");
  });
});
