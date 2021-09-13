import "mocha";
import {Flow} from "../src/main/models/Flow";
import withDescription = require("./testfiles/createproperty.json");
import * as index from "../src/index";
import {expect} from "chai";
import {ScannerOptions} from "../src/main/models/ScannerOptions";

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
    ruleOptions = new ScannerOptions(['DuplicateDMLOperationsByNavigation']);

  });
  it("there is no result for that override", async function () {

    // ACT
    const scanResults = index.scan([flow], ruleOptions);

    // ASSERT
    expect(scanResults[0].ruleResults.length).to.equal(1);
    expect(scanResults[0].ruleResults.find(result => result.ruleName === "DuplicateDMLOperationsByNavigation").details.length).to.equal(3);

  });
});
