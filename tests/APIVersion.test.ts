import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

describe("APIVersion", () => {
  let expect;
  beforeAll(async () => {
    expect = (await import("chai")).expect;
  });
  const example_uri = path.join(__dirname, "./xmlfiles/Outdated_API_Version.flow-meta.xml");
  const fixed_uri = path.join(__dirname, "./xmlfiles/Outdated_API_Version_Fixed.flow-meta.xml");

  it("should have a result when attribute is missing", async () => {
    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: {
        APIVersion: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).toBe(1);
    expect(results[0].ruleResults[0].ruleName).toBe("APIVersion");
    expect(results[0].ruleResults[0].occurs).toBe(true);
  });

  it("should have a result when below configured threshold", async () => {
    let flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: {
        APIVersion: {
          severity: "error",
          expression: ">55",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).toBe(1);
    expect(results[0].ruleResults[0].ruleName).toBe("APIVersion");
    expect(results[0].ruleResults[0].occurs).toBe(true);
  });

  it("should have no result when version is meeting threshold", async () => {
    let flows = await core.parse([fixed_uri]);
    const ruleConfig = {
      rules: {
        APIVersion: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.length).toBe(1);
    expect(results[0].ruleResults[0].ruleName).toBe("APIVersion");
    expect(results[0].ruleResults[0].occurs).toBe(false);
  });
});
