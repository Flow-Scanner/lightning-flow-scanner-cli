import * as core from "../src";
import * as path from "path";

import { describe, it, expect } from "@jest/globals";

describe("HardcodedSecret", () => {
  const example_uri = path.join(__dirname, "../../../example-flows/force-app/testing/Hardcoded_Secret.flow-meta.xml");

  it("should not be available without betaMode", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const ruleNames = results[0].ruleResults.map((r) => r.ruleName);
    expect(ruleNames).not.toContain("HardcodedSecret");
  });

  it("should be available with betaMode enabled", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows, { betaMode: true });
    const ruleNames = results[0].ruleResults.map((r) => r.ruleName);
    expect(ruleNames).toContain("HardcodedSecret");
  });

  it("should detect Stripe secret key in flow variable", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows, { betaMode: true });
    const secretRule = results[0].ruleResults.find((r) => r.ruleName === "HardcodedSecret");

    expect(secretRule).toBeDefined();
    expect(secretRule!.occurs).toBe(true);
    expect(secretRule!.details.length).toBeGreaterThan(0);
  });
});
