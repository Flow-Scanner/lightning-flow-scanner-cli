import { describe, expect, it } from "@jest/globals";

import { ParsedFlow, scan, ScanResult } from "../src";
import { Flow } from "../src/main/models/Flow";
import { ActionCallsInLoop } from "../src/main/rules/ActionCallsInLoop";

describe("ActionCallsInLoop", () => {
  it("should be defined", () => {
    expect(ActionCallsInLoop).toBeDefined();
  });

  describe("e2e", () => {
    it("should flag action calls in loops", () => {
      const config = {
        rules: {
          ActionCallsInLoop: {
            severity: "error",
          },
        },
      };

      const flows: ParsedFlow[] = [
        {
          flow: {
            elements: [
              {
                connectors: [],
                element: {
                  actionName: "FeedItem.NewTaskFromFeedItem",
                  actionType: "quickAction",
                  description: "Create Case Manually",
                  flowTransactionModel: "CurrentTransaction",
                  inputParameters: {
                    name: "contextId",
                    value: {
                      elementReference: "createCase.OwnerId",
                    },
                  },
                  label: "Create case manually",
                  locationX: "0",
                  locationY: "0",
                  name: "create_case_manually",
                  nameSegment: "FeedItem.NewTaskFromFeedItem",
                  versionSegment: "1",
                },
                locationX: "0",
                locationY: "0",
                metaType: "node",
                name: "create_case_manually",
                subtype: "actionCalls",
              },
              {
                connectors: [
                  {
                    element: { targetReference: "create_case_manually" },
                    reference: "create_case_manually",
                    type: "nextValueConnector",
                  },
                ],
                element: {
                  collectionReference: "Accounts",
                  description: "an example loop",
                  iterationOrder: "Asc",
                  label: "aLoop",
                  locationX: "0",
                  locationY: "0",
                  name: "aLoop",
                  nextValueConnector: {
                    targetReference: "create_case_manually",
                  },
                },
                locationX: "0",
                locationY: "0",
                metaType: "node",
                name: "aLoop",
                subtype: "loops",
              },
            ],
            type: "AutoLaunchedFlow",
          },
        } as Partial<ParsedFlow> as ParsedFlow,
      ];

      const results: ScanResult[] = scan(flows, config);
      const scanResults = results.pop();
      const ruleResults = scanResults?.ruleResults.filter((rule) => {
        return rule.ruleDefinition.name === "ActionCallsInLoop" && rule.occurs;
      });
      expect(ruleResults).toHaveLength(1);
    });
  });

  describe("execute", () => {
    let rule: ActionCallsInLoop;
    beforeEach(() => {
      rule = new ActionCallsInLoop();
    });

    it("should not occur when no loops are present", () => {
      const flow = {
        elements: [
          {
            connectors: [{}],
            element: {
              actionName: "FeedItem.NewTaskFromFeedItem",
              actionType: "quickAction",
              description: "Create Case Manually",
              flowTransactionModel: "CurrentTransaction",
              inputParameters: {
                name: "contextId",
                value: {
                  elementReference: "createCase.OwnerId",
                },
              },
              label: "Create case manually",
              locationX: "0",
              locationY: "0",
              name: "create_case_manually",
              nameSegment: "FeedItem.NewTaskFromFeedItem",
              versionSegment: "1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "create_case_manually",
            subtype: "actionCalls",
          },
        ],
        type: "AutoLaunchedFlow",
      } as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(false);
    });

    it("should not occur when there are loops but no action calls", () => {
      const flow = {
        elements: [
          {
            connectors: [],
            element: {
              assignmentItems: {
                assignToReference: "testVar",
                operator: "Assign",
                value: {
                  numberValue: "1.0",
                },
              },
              label: "assignvalue1",
              locationX: "0",
              locationY: "0",
              name: "assignvalue1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "assignvalue1",
            subtype: "assignments",
          },
          {
            connectors: [
              {
                element: { targetReference: "create_case_manually" },
                reference: "create_case_manually",
                type: "nextValueConnector",
              },
            ],
            element: {
              collectionReference: "Accounts",
              description: "an example loop",
              iterationOrder: "Asc",
              label: "aLoop",
              locationX: "0",
              locationY: "0",
              name: "aLoop",
              nextValueConnector: {
                targetReference: "create_case_manually",
              },
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "aLoop",
            subtype: "loops",
          },
        ],
        type: "AutoLaunchedFlow",
      } as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(false);
    });

    it("should not occur when action call is the last element of the loop", () => {
      const flow = {
        elements: [
          {
            connectors: [],
            element: {
              assignmentItems: {
                assignToReference: "testVar",
                operator: "Assign",
                value: {
                  numberValue: "1.0",
                },
              },
              label: "assignvalue1",
              locationX: "0",
              locationY: "0",
              name: "assignvalue1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "assignvalue1",
            subtype: "assignments",
          },
          {
            connectors: [],
            element: {
              actionName: "FeedItem.NewTaskFromFeedItem",
              actionType: "quickAction",
              description: "Create Case Manually",
              flowTransactionModel: "CurrentTransaction",
              inputParameters: {
                name: "contextId",
                value: {
                  elementReference: "createCase.OwnerId",
                },
              },
              label: "Create case manually",
              locationX: "0",
              locationY: "0",
              name: "create_case_manually",
              nameSegment: "FeedItem.NewTaskFromFeedItem",
              versionSegment: "1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "create_case_manually",
            subtype: "actionCalls",
          },
          {
            connectors: [
              {
                element: { targetReference: "assignvalue1" },
                reference: "assignvalue1",
                type: "nextValueConnector",
              },
              {
                element: { targetReference: "create_case_manually" },
                reference: "create_case_manually",
                type: "noMoreValuesConnector",
              },
            ],
            element: {
              collectionReference: "Accounts",
              description: "an example loop",
              iterationOrder: "Asc",
              label: "aLoop",
              locationX: "0",
              locationY: "0",
              name: "aLoop",
              nextValueConnector: {
                targetReference: "assignvalue1",
              },
              noMoreValuesConnector: {
                targetReference: "create_case_manually",
              },
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "aLoop",
            subtype: "loops",
          },
        ],
        type: "AutoLaunchedFlow",
      } as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(false);
    });

    it("should not occur when there are no elements", () => {
      const flow = {
        type: "AutoLaunchedFlow",
      } as unknown as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(false);
    });

    it("should occur when there are action calls in loops", () => {
      const flow = {
        elements: [
          {
            connectors: [],
            element: {
              actionName: "FeedItem.NewTaskFromFeedItem",
              actionType: "quickAction",
              description: "Create Case Manually",
              flowTransactionModel: "CurrentTransaction",
              inputParameters: {
                name: "contextId",
                value: {
                  elementReference: "createCase.OwnerId",
                },
              },
              label: "Create case manually",
              locationX: "0",
              locationY: "0",
              name: "create_case_manually",
              nameSegment: "FeedItem.NewTaskFromFeedItem",
              versionSegment: "1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "create_case_manually",
            subtype: "actionCalls",
          },
          {
            connectors: [
              {
                element: { targetReference: "create_case_manually" },
                reference: "create_case_manually",
                type: "nextValueConnector",
              },
            ],
            element: {
              collectionReference: "Accounts",
              description: "an example loop",
              iterationOrder: "Asc",
              label: "aLoop",
              locationX: "0",
              locationY: "0",
              name: "aLoop",
              nextValueConnector: {
                targetReference: "create_case_manually",
              },
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "aLoop",
            subtype: "loops",
          },
        ],
        type: "AutoLaunchedFlow",
      } as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(true);
    });

    it("should occur when connector is nested in loops", () => {
      const flow = {
        elements: [
          {
            connectors: [
              {
                element: { targetReference: "create_case_manually" },
                reference: "create_case_manually",
                type: "connector",
              },
            ],
            element: {
              assignmentItems: {
                assignToReference: "testVar",
                operator: "Assign",
                value: {
                  numberValue: "1.0",
                },
              },
              label: "assignvalue1",
              locationX: "0",
              locationY: "0",
              name: "assignvalue1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "assignvalue1",
            subtype: "assignments",
          },
          {
            connectors: [],
            element: {
              actionName: "FeedItem.NewTaskFromFeedItem",
              actionType: "quickAction",
              description: "Create Case Manually",
              flowTransactionModel: "CurrentTransaction",
              inputParameters: {
                name: "contextId",
                value: {
                  elementReference: "createCase.OwnerId",
                },
              },
              label: "Create case manually",
              locationX: "0",
              locationY: "0",
              name: "create_case_manually",
              nameSegment: "FeedItem.NewTaskFromFeedItem",
              versionSegment: "1",
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "create_case_manually",
            subtype: "actionCalls",
          },
          {
            connectors: [
              {
                element: { targetReference: "assignvalue1" },
                reference: "assignvalue1",
                type: "nextValueConnector",
              },
            ],
            element: {
              collectionReference: "Accounts",
              description: "an example loop",
              iterationOrder: "Asc",
              label: "aLoop",
              locationX: "0",
              locationY: "0",
              name: "aLoop",
              nextValueConnector: {
                targetReference: "assignvalue1",
              },
            },
            locationX: "0",
            locationY: "0",
            metaType: "node",
            name: "aLoop",
            subtype: "loops",
          },
        ],
        type: "AutoLaunchedFlow",
      } as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(true);
    });
  });
});
