import * as core from "../src";
import * as path from "path";

import { describe, it, expect } from "@jest/globals";

describe("CyclomaticComplexity ", () => {
  const example_uri = path.join(__dirname, "./xmlfiles/Cyclomatic_Complexity.flow-meta.xml");
  const other_uri = path.join(__dirname, "./xmlfiles/SOQL_Query_In_A_Loop.flow-meta.xml");

  it("should have a result when there are more than 25 decision options", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).toBeGreaterThanOrEqual(1);
    // expect(occurringResults[0].ruleName).toBe("CyclomaticComplexity");
  });

  it("should have no result when value is below threshold", async () => {
    const flows = await core.parse([other_uri]);
    const ruleConfig = {
      rules: {
        CyclomaticComplexity: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });

  it("should have a result when value surpasses a configured threshold", async () => {
    const flows = await core.parse([other_uri]);
    const ruleConfig = {
      rules: {
        CyclomaticComplexity: {
          threshold: 1,
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
  });
});
