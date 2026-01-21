import { describe, expect, it } from "@jest/globals";
import * as path from "path";
import * as core from "../src";

describe("MissingRecordTriggerFilter", () => {
  const violating_uri = path.join(
    __dirname,
    "../../../example-flows/force-app/testing/Trigger_Without_Filter.flow-meta.xml"
  );
  
  const fixed_uri = path.join(
    __dirname,
    "../../../example-flows/force-app/testing/TriggerWithoutFilter_Fixed.flow-meta.xml"
  );

  const formulaFilter_uri = path.join(
    __dirname,
    "../../../example-flows/force-app/testing/TriggerWithFormulaFilter.flow-meta.xml"
  );

  it("should return a violation for flow without filters", async () => {
    const flows = await core.parse([violating_uri]);
    expect(flows.length).toBeGreaterThan(0);
    const ruleConfig = {
      ruleMode: "isolated",
      betamode: true,
      rules: {
        MissingFilterRecordTrigger: {
          severity: "warning"
        }
      }
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results.length).toBeGreaterThan(0);
    const ruleResult = results[0].ruleResults.find(r => r.ruleName === "MissingRecordTriggerFilter");
    expect(ruleResult).toBeDefined();
    expect(ruleResult.occurs).toBe(true);
    expect(ruleResult.details.length).toBeGreaterThan(0);
  });

  it("should not return a result for flow with filters", async () => {
    const flows = await core.parse([fixed_uri]);
    expect(flows.length).toBeGreaterThan(0);
    const ruleConfig = {
      ruleMode: "isolated",
      betamode: true,
      rules: {
        MissingFilterRecordTrigger: {
          severity: "warning"
        }
      }
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results.length).toBeGreaterThan(0);
    const ruleResult = results[0].ruleResults.find(r => r.ruleName === "MissingRecordTriggerFilter");
    expect(ruleResult).toBeDefined();
    expect(ruleResult.occurs).toBe(false);
  });

  it("should not return a result for flow with formula-based filter condition", async () => {
    // This test verifies that flows using filterFormula (formula-based entry conditions)
    // are not flagged as missing filters
    const flows = await core.parse([formulaFilter_uri]);
    expect(flows.length).toBeGreaterThan(0);
    const ruleConfig = {
      ruleMode: "isolated",
      betamode: true,
      rules: {
        MissingFilterRecordTrigger: {
          severity: "warning"
        }
      }
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results.length).toBeGreaterThan(0);
    const ruleResult = results[0].ruleResults.find(r => r.ruleName === "MissingRecordTriggerFilter");
    expect(ruleResult).toBeDefined();
    expect(ruleResult.occurs).toBe(false);
  });
});