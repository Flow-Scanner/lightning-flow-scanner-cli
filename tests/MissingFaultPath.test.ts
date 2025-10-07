import { describe, expect, it } from "@jest/globals";
import * as path from "path";

import { Flow, parse, RuleResult, scan, ScanResult } from "../src";
import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { MissingFaultPath } from "../src/main/rules/MissingFaultPath";

describe("MissingFaultPath", () => {
  const example_uri = path.join(__dirname, "../example-flows/force-app/main/default/flows/Missing_Error_Handler.flow-meta.xml");
  const fixed_uri = path.join(__dirname, "../example-flows/force-app/main/default/flows/Missing_Error_Handler_Fixed.flow-meta.xml");

  it("there should be one result for the rule MissingFaultPath", async () => {
    const flows = await parse([example_uri]);
    const config = {
      rules: {
        MissingFaultPath: {
          severity: "error",
        },
      },
    };
    const results: ScanResult[] = scan(flows, config);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].ruleName).toBe("MissingFaultPath");
  });

  it("Should have no result", async () => {
    const flows = await parse([fixed_uri]);
    const results: ScanResult[] = scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });

  it("should skip before save flows due to salesforce limitation", async () => {
    const { default: rawFile } = await import(
      "./jsonfiles/MissingFaultPath_BeforeSave_Bypass.json"
    );
    const parsedFile: ParsedFlow[] = rawFile as unknown as ParsedFlow[];
    const missingFaultPathRule = new MissingFaultPath();
    const flow: Flow = parsedFile.pop()?.flow as Flow;
    const scanResults: RuleResult = missingFaultPathRule.execute(flow);
    expect(scanResults.occurs).toBe(false);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("should not occur when actionName is suppressed", async () => {
    process.env.IS_NEW_SCAN_ENABLED = "true";
    const flows = await parse([example_uri]);
    const config = {
      rules: {
        MissingFaultPath: {
          severity: "error",
          suppressions: ["LogACall"],
        },
      },
    };
    const results: ScanResult[] = scan(flows, config);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });

  it("should not flag WaitDuration elements as missing fault path", async () => {
    const { default: rawFile } = await import("./jsonfiles/MissingFaultPath_WaitDuration.json");
    const parsedFile: ParsedFlow[] = rawFile as unknown as ParsedFlow[];
    const missingFaultPathRule = new MissingFaultPath();
    const flow: Flow = parsedFile.pop()?.flow as Flow;
    const scanResults: RuleResult = missingFaultPathRule.execute(flow);
    expect(scanResults.occurs).toBe(false);
  });

  it("should not flag WaitDate elements as missing fault path", async () => {
    const { default: rawFile } = await import("./jsonfiles/MissingFaultPath_WaitDate.json");
    const parsedFile: ParsedFlow[] = rawFile as unknown as ParsedFlow[];
    const missingFaultPathRule = new MissingFaultPath();
    const flow: Flow = parsedFile.pop()?.flow as Flow;
    const scanResults: RuleResult = missingFaultPathRule.execute(flow);
    expect(scanResults.occurs).toBe(false);
  });

  it("should flag Wait For Conditions elements as missing fault path", async () => {
    const { default: rawFile } = await import("./jsonfiles/MissingFaultPath_WaitConditions.json");
    const parsedFile: ParsedFlow[] = rawFile as unknown as ParsedFlow[];
    const missingFaultPathRule = new MissingFaultPath();
    const flow: Flow = parsedFile.pop()?.flow as Flow;
    const scanResults: RuleResult = missingFaultPathRule.execute(flow);
    expect(scanResults.occurs).toBe(true);
  });
});
