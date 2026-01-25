import { describe, expect, it } from "@jest/globals";
import * as path from "path";

import * as core from "../src";

describe("SOQLQueryInLoop ", () => {
  const example_uri = path.join(__dirname, "../../../example-flows/force-app/demo/Missing_Start_Reference_Flow.flow-meta.xml");

  const config = {
    ruleMode: "isolated",
    rules: {
      MissingStartReference: {
        severity: "error",
      },
    },
  };

  it("there should be start element in Flow", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows, config);
    const MissingStartReferencerule = results[0].ruleResults.find(
      (rule) => rule.occurs && rule.ruleName === "MissingStartReference"
    );
    expect(MissingStartReferencerule?.occurs).toBe(true);
  });

});
