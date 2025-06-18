import * as core from "../src";
import * as path from "path";

import { describe, it, expect } from "@jest/globals";

describe("MissingNullHandler ", () => {
  const example_uri = path.join(__dirname, "../example-flows/force-app/main/default/flows/Missing_Null_Handler.flow-meta.xml");
  const fixed_uri = path.join(__dirname, "../example-flows/force-app/main/default/flows/Missing_Null_Handler_Fixed.flow-meta.xml");

  it("should return a result when no fault path is implemented", async () => {
    const flows = await core.parse([example_uri]);
    const ruleConfig = {
      rules: {
        MissingNullHandler: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults[0].ruleName).toBe("MissingNullHandler");
    expect(results[0].ruleResults[0].occurs).toBe(true);
  });

  it("should return no result when null handlers are implemented", async () => {
    const flows = await core.parse([fixed_uri]);
    const ruleConfig = {
      rules: {
        MissingNullHandler: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    expect(results[0].ruleResults[0].ruleName).toBe("MissingNullHandler");
    expect(results[0].ruleResults[0].occurs).toBe(false);
  });
});
