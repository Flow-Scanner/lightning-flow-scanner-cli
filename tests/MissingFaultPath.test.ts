import "mocha";
import * as core from "../src";
import * as path from "path-browserify";
import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { MissingFaultPath } from "../src/main/rules/MissingFaultPath";

describe("MissingFaultPath", () => {
  let expect;
  beforeAll(async () => {
    expect = (await import("chai")).expect;
  });
  let example_uri = path.join(__dirname, "./xmlfiles/Missing_Error_Handler.flow-meta.xml");
  let fixed_uri = path.join(__dirname, "./xmlfiles/Missing_Error_Handler_Fixed.flow-meta.xml");

  it("there should be one result for the rule MissingFaultPath", async () => {
    let flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).toBe(1);
    expect(occurringResults[0].ruleName).toBe("MissingFaultPath");
  });

  it("Should have no result", async () => {
    let flows = await core.parse([fixed_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).toBe(0);
  });

  it("should skip before save flows due to salesforce limitation", async () => {
    const { default: rawFile } = await import(
      "./jsonfiles/MissingFaultPath_BeforeSave_Bypass.json",
      {
        with: { type: "json" },
      }
    );
    const parsedFile: ParsedFlow[] = rawFile as {} as ParsedFlow[];
    const missingFaultPathRule = new MissingFaultPath();
    const flow: core.Flow = parsedFile.pop()?.flow as core.Flow;
    const scanResults: core.RuleResult = missingFaultPathRule.execute(flow);
    expect(scanResults.occurs).toBe(false);
  });
});
