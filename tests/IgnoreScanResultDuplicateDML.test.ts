import "mocha";
import {Flow} from "../src/main/models/Flow";
import withDescription = require("./testfiles/createproperty.json");
import * as index from "../src/index";
import {expect} from "chai";
import {ScannerOptions} from "../src/main/models/ScannerOptions";
import {Override} from "../src/main/models/Override";
import {FlowScanOverrides} from "../src/main/models/FlowScanOverrides";

describe("When there is a a rule override",async function () {
  let flow;
  let ruleOptions;

  before("arrange",  async function () {

    // ARRANGE
    flow = new Flow({
      label: 'Create Property',
      path: 'anypath',
      xmldata : withDescription,
      detail: 'anypath'
    });
    ruleOptions = new ScannerOptions(undefined, [new FlowScanOverrides('Create Property', [new Override('DuplicateDMLOperationsByNavigation', 'error_creating_records')])]);

  });
  it("there is no result for that override", async function () {

    // ACT
    const scanResults = index.Scan([flow], ruleOptions);

    // ASSERT
    expect(scanResults[0].ruleResults.find(result => result.ruleName === "DuplicateDMLOperationsByNavigation").details.length).to.equal(2);
    expect(scanResults[0].ruleResults.find(result => result.ruleName === "DuplicateDMLOperationsByNavigation").occurs).to.equal(true);

    // assert.strictEqual(missingDescription, false);
  });
});
