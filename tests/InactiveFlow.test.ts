import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { scan, ScanResult } from "../src";

import { describe, it, expect } from "@jest/globals";

describe("InactiveFlow", () => {
  it("should return a result when flow is inactive", async () => {
    const flows: ParsedFlow[] = [
      {
        flow: {
          elements: [
            {
              subtype: "status",
              element: "Draft",
            },
          ],
          type: "AutoLaunchedFlow",
        },
      } as unknown as ParsedFlow,
    ];
    const ruleConfig = {
      rules: {
        InactiveFlow: {
          severity: "error",
        },
      },
    };

    const results: ScanResult[] = scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].ruleName).toBe("InactiveFlow");
  });

  it("should have no result when flow is active", async () => {
    const flows: ParsedFlow[] = [
      {
        flow: {
          elements: [
            {
              subtype: "status",
              element: "Active",
            },
          ],
        },
      } as unknown as ParsedFlow,
    ];
    const ruleConfig = {
      rules: {
        InactiveFlow: {
          severity: "error",
        },
      },
    };

    const [result] = scan(flows, ruleConfig);
    expect(result.ruleResults).toHaveLength(1);
    expect(result.ruleResults[0].ruleName).toEqual("InactiveFlow");
    expect(result.ruleResults[0].occurs).toBeFalsy();
  });
});
