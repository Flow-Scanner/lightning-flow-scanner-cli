import { describe, expect, it } from "@jest/globals";
import * as path from "path";

import { Flow, parse, RuleResult, scan, ScanResult } from "../src";

describe("MissingFaultPath", () => {
  const exampleUri = path.join(
    __dirname,
    "../../../example-flows/force-app/demo/Missing_Fault_Path.flow-meta.xml"
  );
  const fixedUri = path.join(
    __dirname,
    "../../../example-flows/force-app/testing/Missing_Error_Handler_Fixed.flow-meta.xml"
  );
  const downstreamUri = path.join(
    __dirname,
    "../../../example-flows/force-app/testing/Missing_Fault_Path_Downstream.flow-meta.xml"
  );

  it("should return a result for MissingFaultPath when fault path is missing", async () => {
    const flows: Flow[] = await parse([exampleUri]);
    const config = {
      ruleMode: "isolated",
      rules: { MissingFaultPath: { severity: "error" } },
    };
    const results: ScanResult[] = scan(flows, config);
    const occurringResults = results[0].ruleResults.filter((r) => r.occurs);

    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].ruleName).toBe("MissingFaultPath");
  });

  it("should return no result when fault path is implemented", async () => {
    const flows: Flow[] = await parse([fixedUri]);
    const results: ScanResult[] = scan(flows);
    const occurringResults = results[0].ruleResults.filter((r) => r.occurs);

    expect(occurringResults).toHaveLength(0);
  });

  it("should not flag elements that are downstream of a fault path", async () => {
    // This test verifies that elements connected via normal connectors from fault handlers
    // are not flagged for missing fault paths (they're already part of fault handling)
    const flows: Flow[] = await parse([downstreamUri]);
    const config = {
      ruleMode: "isolated",
      rules: { MissingFaultPath: { severity: "error" } },
    };
    const results: ScanResult[] = scan(flows, config);
    const occurringResults = results[0].ruleResults.filter((r) => r.occurs);

    // Should have no violations - both fault_handler and downstream_action are on the fault path
    expect(occurringResults).toHaveLength(0);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("should not occur when actionName is suppressed", async () => {
    process.env.IS_NEW_SCAN_ENABLED = "true";
    const flows: Flow[] = await parse([exampleUri]);
    const config = {
      ruleMode: "isolated",
      rules: {
        MissingFaultPath: { severity: "error", suppressions: ["LogACall"] },
      },
    };
    const results: ScanResult[] = scan(flows, config);
    const occurringResults = results[0].ruleResults.filter((r) => r.occurs);

    expect(occurringResults).toHaveLength(0);
  });
});
