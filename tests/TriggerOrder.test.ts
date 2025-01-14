import "mocha";

import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { TriggerOrder } from "../src/main/rules/TriggerOrder";
import { RuleResult, Flow, parse, scan, ScanResult } from "../src";
import * as path from "path-browserify";

describe("TriggerOrder", () => {
  let expect;
  let rule;
  before(async () => {
    expect = (await import("chai")).expect;
    rule = new TriggerOrder();
  });

  it("should not trigger from default configuration on store", async () => {
    let example_uri1 = path.join(__dirname, "./xmlfiles/Same_Record_Field_Updates.flow-meta.xml");
    let flows = await parse([example_uri1]);
    const ruleConfig = {
      rules: {},
      exceptions: {},
    };
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();

    const ruleResults = scanResults?.ruleResults.find((rule) => {
      return rule.ruleDefinition.name === "TriggerOrder";
    });
    expect(ruleResults).to.not.be.ok;
  });

  it("should trigger when opt-in configuration", async () => {
    let example_uri1 = path.join(__dirname, "./xmlfiles/Same_Record_Field_Updates.flow-meta.xml");
    let flows = await parse([example_uri1]);
    const ruleConfig = {
      rules: {
        TriggerOrder: {
          severity: "error",
        },
      },
      exceptions: {},
    };
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();

    const expectedRule = scanResults?.ruleResults.find((rule) => rule.ruleName === "TriggerOrder");
    expect(expectedRule).to.be.ok;
    expect(expectedRule?.occurs).to.be.true;
    expect(expectedRule?.details[0].details).to.deep.eq({ expression: "10, 20, 30 ..." });
  });

  it("should flag trigger order when not present", async () => {
    const testData: ParsedFlow = {
      flow: {
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
          object: "Account",
          recordTriggerType: "Create",
          triggerType: "RecordBeforeSave",
        },
        elements: [
          {
            element: {
              locationX: "50",
              locationY: "0",
              connector: { targetReference: "Update_triggering_records" },
              object: "Account",
              recordTriggerType: "Create",
              triggerType: "RecordBeforeSave",
            },
            subtype: "start",
            metaType: "node",
            connectors: [
              {
                element: { targetReference: "Update_triggering_records" },
                processed: false,
                type: "connector",
                reference: "Update_triggering_records",
              },
            ],
            name: "flowstart",
            locationX: "50",
            locationY: "0",
          },
        ],
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.true;
  });

  it("should not flag trigger order when present", async () => {
    const testData: ParsedFlow = {
      flow: {
        triggerOrder: 10,
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
          object: "Account",
          recordTriggerType: "Create",
          triggerType: "RecordBeforeSave",
        },
        elements: [
          {
            element: {
              locationX: "50",
              locationY: "0",
              connector: { targetReference: "Update_triggering_records" },
              object: "Account",
              recordTriggerType: "Create",
              triggerType: "RecordBeforeSave",
            },
            subtype: "start",
            metaType: "node",
            connectors: [
              {
                element: { targetReference: "Update_triggering_records" },
                processed: false,
                type: "connector",
                reference: "Update_triggering_records",
              },
            ],
            name: "flowstart",
            locationX: "50",
            locationY: "0",
          },
        ],
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.true;
  });

  it("should not flag trigger order when autolaunched flow", async () => {
    const testData: ParsedFlow = {
      flow: {
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
        },
        elements: [
          {
            element: {
              description: "test",
              name: "Update_triggering_records",
              label: "Update triggering records",
              locationX: "176",
              locationY: "287",
              inputAssignments: { field: "Active__c", value: { stringValue: "Yes" } },
              inputReference: "$Record",
            },
            subtype: "recordUpdates",
            metaType: "node",
            connectors: [],
            name: "Update_triggering_records",
            locationX: "176",
            locationY: "287",
          },
        ],
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.false;
  });
});
