import * as core from "../src";
import * as path from "path-browserify";

import { describe, it, expect } from "@jest/globals";

describe("DMLStatementInLoop ", () => {
  const example_uri = path.join(__dirname, "./xmlfiles/DML_Statement_In_A_Loop.flow-meta.xml");
  const fixed_uri = path.join(__dirname, "./xmlfiles/Duplicate_DML_Operation_Fixed.flow-meta.xml");

  it("there should be one result for the rule DMLStatementInLoop", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].ruleName).toBe("DMLStatementInLoop");
  });

  it("there should be no result for the rule DMLStatementInLoop", async () => {
    const flows = await core.parse([fixed_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });
});
