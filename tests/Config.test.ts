import * as core from "../src";
import * as path from "path-browserify";

import { describe, it, expect } from "@jest/globals";

describe("Rule Configurations ", () => {
  const example_uri1 = path.join(__dirname, "./xmlfiles/Unconnected_Element.flow-meta.xml");

  it(" should use default when no configuration is provided", async () => {
    const flows = await core.parse([example_uri1]);
    const results: core.ScanResult[] = core.scan(flows, undefined);
    const rules = core.getRules();
    expect(results[0].ruleResults).toHaveLength(rules.length);
  });

  it(" should use default when no rules are specified", async () => {
    const flows = await core.parse([example_uri1]);
    const ruleConfig = {
      rules: {},
      exceptions: {
        CreateANewAccountWithChild: { DuplicateDMLOperation: ["ViewAccountId"] },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const rules = core.getRules();
    expect(results[0].ruleResults).toHaveLength(rules.length);
  });

  it("incorrect rule severity configurations are defaulted", async () => {
    const flows = await core.parse([example_uri1]);
    const ruleConfig = {
      rules: {
        MissingNullHandler: {
          severity: "errorr",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults).toHaveLength(1);
  });

  it("incorrect rule configurations are skipped", async () => {
    const flows = await core.parse([example_uri1]);
    jest.spyOn(global.console, "error").mockImplementation(() => {});
    jest.spyOn(global.console, "log").mockImplementation(() => {});

    const ruleConfig = {
      rules: {
        MissingNullHandler: {
          severity: "error",
        },
        MissingNullHandler2: {
          severity: "error",
        },
      },
      exceptions: {
        CreateANewAccountWithChild: { DuplicateDMLOperation: ["ViewAccountId"] },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults).toHaveLength(1);
  });

  it("Multiple Expressions are individually checked", async () => {
    const flows = await core.parse([example_uri1]);
    const ruleConfig = {
      rules: {
        APIVersion: {
          severity: "error",
          expression: ">50",
        },
        CopyAPIName: {
          severity: "error",
        },
        DMLStatementInLoop: {
          severity: "error",
        },
        DuplicateDMLOperation: {
          severity: "error",
        },
        FlowDescription: {
          severity: "error",
        },
        FlowName: {
          severity: "error",
          expression: "[A-Za-z0-9]+_[A-Za-z0-9]+",
        },
        HardcodedId: {
          severity: "error",
        },
        MissingFaultPath: {
          severity: "error",
        },
        MissingNullHandler: {
          severity: "error",
        },
        SOQLQueryInLoop: {
          severity: "error",
        },
        UnconnectedElement: {
          severity: "error",
        },
        UnusedVariable: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults.find((r) => r.ruleName === "FlowName")?.occurs).toBe(false);
  });
});
