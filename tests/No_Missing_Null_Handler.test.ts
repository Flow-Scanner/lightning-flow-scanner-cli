import { describe, expect, it } from "@jest/globals";
import * as path from "path";

import * as core from "../src";

describe("MissingNullHandler ", () => {
  const example_uri = path.join(
    __dirname,
    "../example-flows/force-app/main/default/flows/No_Missing_Null_Handler.flow-meta.flow-meta.xml"
  );
  it("should not return a result ", async () => {
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
    expect(results[0].ruleResults[0].occurs).toBe(false);
  });
});