import * as core from "../src";
import * as path from "path";

import { describe, it, expect } from "@jest/globals";

describe("DuplicateDMLOperation  ", () => {
  const example_uri = path.join(__dirname, "../files/example-flows/force-app/main/default/flows/Duplicate_DML_Operation.flow-meta.xml");
  const fixed_uri = path.join(__dirname, "../files/example-flows/force-app/main/default/flows/Duplicate_DML_Operation_Fixed.flow-meta.xml");

  it("should have 1 result in a flow with a DML statement inbetween screens ", async () => {
    const flows = await core.parse([example_uri]);

    const ruleConfig = {
      rules: {
        DuplicateDMLOperation: {
          severity: "error",
        },
      },
    };
    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(1);
    expect(occurringResults[0].ruleName).toBe("DuplicateDMLOperation");
  });

  it("should have no results in the fixed example", async () => {
    const flows = await core.parse([fixed_uri]);

    const ruleConfig = {
      rules: {
        DuplicateDMLOperation: {
          severity: "error",
        },
      },
    };

    const results: core.ScanResult[] = core.scan(flows, ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults).toHaveLength(0);
  });
});
