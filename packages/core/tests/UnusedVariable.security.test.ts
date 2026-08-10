import * as core from "../src";
import * as path from "path";
import { countLiteralOccurrences } from "../src/main/rules/UnusedVariable";

import { describe, it, expect } from "@jest/globals";

describe("UnusedVariable security (GHSA-fpvw-w7ff-h7vr)", () => {
  const redos_uri = path.join(
    __dirname,
    "../../../example-flows/force-app/testing/Unused_Variable_ReDoS.flow-meta.xml"
  );

  const ruleConfig = {
    ruleMode: "isolated" as const,
    rules: {
      UnusedVariable: {
        severity: "error",
      },
    },
  };

  it("countLiteralOccurrences is case-insensitive and literal", () => {
    expect(countLiteralOccurrences("Foo bar FOO", "foo")).toBe(2);
    expect(countLiteralOccurrences("aaaa", "aa")).toBe(2);
    expect(countLiteralOccurrences("hello", "(a+)+$")).toBe(0);
    expect(countLiteralOccurrences("x(a+)+$y", "(a+)+$")).toBe(1);
    expect(countLiteralOccurrences("anything", "")).toBe(0);
  });

  it("completes quickly and flags unused variable with ReDoS-shaped name", async () => {
    const flows = await core.parse([redos_uri]);
    const started = Date.now();
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const elapsedMs = Date.now() - started;

    // Unescaped RegExp('(a+)+$', 'gi') on long subjects stalls for many seconds.
    // Literal matching must finish well under a second on this fixture.
    expect(elapsedMs).toBeLessThan(2000);

    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].details[0].name).toBe("(a+)+$");
  });

  it("still detects usage when a regex-special variable name is referenced", async () => {
    // Build on the ReDoS fixture: mark the variable used via a screen field reference text.
    const flows = await core.parse([redos_uri]);
    const flow = flows[0].flow!;
    const screen = flow.elements.find((el) => el.name === "mock_screen") as any;
    expect(screen).toBeDefined();

    // Inject a literal reference into both fields and element so stringify sees the name.
    const fields = [
      {
        name: "display",
        fieldText: "Value: {!((a+)+$)}",
        fieldType: "DisplayText",
      },
    ];
    screen.fields = fields;
    screen.element = { ...(screen.element ?? {}), fields };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });
});
