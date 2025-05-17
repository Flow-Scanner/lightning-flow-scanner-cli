import { describe, expect, it } from "@jest/globals";

import { Flow } from "../src/main/models/Flow";
import { ActionCallsInLoop } from "../src/main/rules/ActionCallsInLoop";

describe("ActionCallsInLoop", () => {
  it("should be defined", () => {
    expect(ActionCallsInLoop).toBeDefined();
  });

  describe("e2e", () => {
    it("should flag action calls in loops", () => {});
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

    it("should not occur when there are loops but no action calls", () => {});

    it("should not occur when there are no elements", () => {
      const flow = {
        elements: [{}],
        type: "AutoLaunchedFlow",
      } as Flow;

      const result = rule.execute(flow);
      expect(result.occurs).toBe(false);
    });

    it("should occur when there are action calls in loops", () => {});
  });
});
