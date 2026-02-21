import { describe, expect, it } from "@jest/globals";
import * as path from "path";

import * as core from "../src";

describe("loopnextconnectormissing ", () => {
  const example_uri = path.join(__dirname, "../../../example-flows/force-app/demo/Missing_Next_value_Connector_Flow.flow-meta.xml");

  const example_uri2 = path.join(__dirname, "../../../example-flows/force-app/testing/Missing_Next_value_Connector_Flow_Fixed.flow-meta.xml");
  const config = {
    ruleMode: "isolated",
    rules: {
      MissingLoopNextConnector: {
        severity: "error",
      },
    },
  };

  it("there should be next value connector in loop", async () => {
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows,config);
    const MissingLoopNextConnectorrule = results[0].ruleResults.find(
      (rule) => rule.occurs && rule.ruleName === "MissingLoopNextConnector"
    );
    expect(MissingLoopNextConnectorrule?.occurs).toBe(true);
  });

    it("next value connector added in loop", async () => {
    const flows = await core.parse([example_uri2]);
    const results: core.ScanResult[] = core.scan(flows,config);
    const MissingLoopNextConnectorrule = results[0].ruleResults.find(
      (rule) => rule.occurs && rule.ruleName === "MissingLoopNextConnector"
    );
    expect(MissingLoopNextConnectorrule?.occurs).toBe(undefined);
  });
});
