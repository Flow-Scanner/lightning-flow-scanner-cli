import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

describe("CopyAPIName ", () => {
  let expect;
  beforeAll(async () => {
    expect = (await import("chai")).expect;
  });
  let example_uri = path.join(__dirname, "./xmlfiles/Copy_API_Name.flow-meta.xml");
  let fixed_uri = path.join(__dirname, "./xmlfiles/Copy_API_Name_Fixed.flow-meta.xml");

  it("CopyAPIName should have a result", async () => {
    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: {
        CopyAPIName: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);

    expect(results[0].ruleResults.length).toBe(1);
    expect(results[0].ruleResults[0].ruleName).toBe("CopyAPIName");
    expect(results[0].ruleResults[0].occurs).toBe(true);
  });

  it("CopyAPIName should have no result", async () => {
    let flows = await core.parse([fixed_uri]);
    const ruleConfig = {
      rules: {
        CopyAPIName: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);

    expect(results[0].ruleResults.length).toBe(1);
    expect(results[0].ruleResults[0].ruleName).toBe("CopyAPIName");
    expect(results[0].ruleResults[0].occurs).toBe(false);
  });
});
