import { expect } from "chai";
import "mocha";
import * as core from "../src";
import * as path from "path-browserify";

describe("UnconnectedElement", () => {
  it("there should be checks for unconnected element", async () => {
    const example_uri = path.join(__dirname, "./xmlfiles/Unconnected_Element.flow-meta.xml");
    const flows = await core.parse([example_uri]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.find((res) => res.ruleName === "UnconnectedElement"));
  });

  it("async path there should be checks for unconnected element", async () => {
    const connectedElementTestFile = path.join(
      __dirname,
      "./xmlfiles/Unconnected_Element_Async.flow-meta.xml"
    );
    const flows = await core.parse([connectedElementTestFile]);
    const results: core.ScanResult[] = core.scan(flows);
    const occurringResults = results.pop()?.ruleResults.filter((rule) => rule.occurs);
    const unconnectedElementResult = occurringResults?.filter(
      (res) => res.ruleName === "UnconnectedElement"
    );
    expect(unconnectedElementResult);
    unconnectedElementResult?.forEach((unconnectedElem) => {
      expect(unconnectedElem.details.pop()?.name).to.equal("UnconnectedElementTestOnAsync");
    });
  });
});
