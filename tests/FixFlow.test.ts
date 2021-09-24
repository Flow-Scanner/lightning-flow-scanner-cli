import "mocha";
import * as index from "../src/index";
import {expect} from "chai";
import {Flow} from "../src/main/models/Flow";
import mainFlow = require("./testfiles/mainflow.json");

describe("When there is a a rule override",async function () {
  let flow;
  let ruleOptions;

  before("arrange",  async function () {

    // ARRANGE
    flow = new Flow({
      label: 'Open Reservation',
      path: 'anypath',
      xmldata : mainFlow,
      detail: 'anypath'
    });

  });
  it("there is no result for that override", async function () {

    // ACT
    const fixResults = index.fix([flow]);
    expect(fixResults[0].ruleResults.find(result => result.ruleName === "UnusedVariables").details.length).to.equal(1);

    const scanResults = index.scan([fixResults[0].flow]);
    // ASSERT
    expect(scanResults[0].ruleResults.find(result => result.ruleName === "UnusedVariables").details.length).to.equal(0);
  });
});
