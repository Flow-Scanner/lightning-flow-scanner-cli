import { describe, expect, it } from "@jest/globals";
import * as path from "path";

import * as core from "../src";
import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { MissingFaultPath } from "../src/main/rules/MissingFaultPath";

describe("MissingFaultPath", () => {
  const example_uri = path.join(__dirname, "./xmlfiles/Missing_Error_Handler.flow-meta.xml");
  const fixed_uri = path.join(__dirname, "./xmlfiles/Missing_Error_Handler_Fixed.flow-meta.xml");

  it("there should be one result for the rule MissingFaultPath", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].ruleName).toBe("MissingFaultPath");
  });

  it("Should have no result", async () => {
    const flows = await core.parse([fixed_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });

  it("should skip before save flows due to salesforce limitation", async () => {
    const { default: rawFile } = await import(
      "./jsonfiles/MissingFaultPath_BeforeSave_Bypass.json"
    );
    const parsedFile: ParsedFlow[] = rawFile as unknown as ParsedFlow[];
    const missingFaultPathRule = new MissingFaultPath();
    const flow: core.Flow = parsedFile.pop()?.flow as core.Flow;
    const scanResults: core.RuleResult = missingFaultPathRule.execute(flow);
    expect(scanResults.occurs).toBe(false);
  });
});
