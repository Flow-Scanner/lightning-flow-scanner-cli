import "mocha";

import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { SameRecordFieldUpdates } from "../src/main/rules/SameRecordFieldUpdates";
import { RuleResult, Flow } from "../src";

describe("SameRecordFieldUpdates", () => {
  let expect;
  let rule;
  before(async () => {
    expect = (await import("chai")).expect;
    rule = new SameRecordFieldUpdates();
  });

  it("should flag same record updates on before context flows", async () => {
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

  it("should not flag same record updates on after context flows", async () => {
    const testData: ParsedFlow = {
      flow: {
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
          object: "Account",
          recordTriggerType: "Create",
          triggerType: "RecordAfterSave",
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
          {
            element: {
              locationX: "50",
              locationY: "0",
              connector: { targetReference: "Update_triggering_records" },
              object: "Account",
              recordTriggerType: "Create",
              triggerType: "RecordAfterSave",
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

    expect(ruleResult.occurs).to.be.false;
  });
});
