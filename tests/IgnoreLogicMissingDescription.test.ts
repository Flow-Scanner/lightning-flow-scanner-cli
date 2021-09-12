import "mocha";
import {Flow} from "../src/main/models/Flow";
import withDescription = require("./testfiles/createproperty.json");
import * as index from "../src/index";
import {expect} from "chai";
import {RuleOptions} from "../src/main/models/RuleOptions";
import {RuleOption} from "../src/main/models/RuleOption";

describe("When there is a a rule override",async function () {
  let flow;
  let ruleOptions;

  before("arrange",  async function () {

    // ARRANGE
    flow = new Flow({
      label: 'main',
      path: 'anypath',
      xmldata : withDescription,
      detail: 'anypath'
    });
    ruleOptions = new RuleOptions([new RuleOption("MissingFlowDescription", "off"), new RuleOption("Missing Flow Description", "off")], []);

  });
  it("there is no missing flow description", async function () {

    // ACT
    const scanResults = index.scan([flow], undefined, ruleOptions);

    // ASSERT
    expect(scanResults[0].ruleResults.find(result => result.ruleName === "MissingFlowDescription").results.length).to.equal(0);
    // assert.strictEqual(missingDescription, false);
  });
});
