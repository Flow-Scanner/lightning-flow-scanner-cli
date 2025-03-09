import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { RuleResult, Flow, scan, ScanResult } from "../src";
import { TriggerOrder } from "../src/main/rules/TriggerOrder";

import { describe, it, expect } from "@jest/globals";

describe("TriggerOrder", () => {
  it("should be included from default configuration on store", async () => {
    const flows: ParsedFlow[] = [
      {
        flow: {
          type: "AutoLaunchedFlow",
        },
      } as unknown as ParsedFlow,
    ];
    const results: ScanResult[] = scan(flows, {});
    const scanResults = results.pop();

    const ruleResults = scanResults?.ruleResults.find((rule) => {
      return rule.ruleDefinition.name === "TriggerOrder";
    }) as RuleResult;
    expect(ruleResults).toBeTruthy();
    expect(ruleResults.occurs).toBeTruthy();
    expect(ruleResults.severity).toBe("note");
  });

  it("should not trigger from default configuration on store", async () => {
    const ruleConfig = {
      rules: {
        FlowDescription: {
          severity: "error",
        },
      },
      exceptions: {},
    };
    const flows: ParsedFlow[] = [
      {
        flow: {
          type: "AutoLaunchedFlow",
        },
      } as unknown as ParsedFlow,
    ];
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();

    const ruleResults = scanResults?.ruleResults.find((rule) => {
      return rule.ruleDefinition.name === "TriggerOrder";
    });
    expect(ruleResults).toBeFalsy();
  });

  it("should trigger when opt-in configuration", async () => {
    const flows: ParsedFlow[] = [
      {
        flow: {
          type: "AutoLaunchedFlow",
        },
      } as unknown as ParsedFlow,
    ];

    const ruleConfig = {
      rules: {
        TriggerOrder: {
          severity: "note",
        },
      },
      exceptions: {},
    };
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();

    const expectedRule = scanResults?.ruleResults.find((rule) => rule.ruleName === "TriggerOrder");
    expect(expectedRule).toBeTruthy();
    expect(expectedRule?.occurs).toBe(true);
    expect(expectedRule?.details[0].details).toEqual({ expression: "10, 20, 30 ..." });
  });

  it("should flag trigger order when not present", async () => {
    const testData: ParsedFlow = {
      flow: {
        type: "AutoLaunchedFlow",
      },
    } as unknown as ParsedFlow;

    const ruleResult: RuleResult = new TriggerOrder().execute(testData.flow as Flow);

    expect(ruleResult.occurs).toBeTruthy();
  });

  it("should not flag trigger order when present", async () => {
    const testData: ParsedFlow = {
      flow: {
        triggerOrder: 10,
        type: "AutoLaunchedFlow",
      },
    } as unknown as ParsedFlow;

    const ruleResult: RuleResult = new TriggerOrder().execute(testData.flow as Flow);

    expect(ruleResult.occurs).toBeFalsy();
  });
});
