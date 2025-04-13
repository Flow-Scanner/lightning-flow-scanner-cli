import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { RuleResult, Flow, scan } from "../src";

import { describe, it, expect } from "@jest/globals";
import { RecursiveAfterUpdate } from "../src/main/rules/RecursiveAfterUpdate";

describe("RecursiveAfterUpdate", () => {
  const rule = new RecursiveAfterUpdate();

  describe("e2e", () => {
    it("should not trigger from default configuration on store", () => {
      const testData: ParsedFlow = {
        flow: {
          start: { recordTriggerType: "CreateAndUpdate", triggerType: "RecordAfterSave" },
          elements: [
            {
              subtype: "recordUpdates",
              metaType: "node",
              element: {
                inputReference: "$Record",
              },
            },
          ],
          type: "AutoLaunchedFlow",
        },
      } as Partial<ParsedFlow> as ParsedFlow;
      const ruleConfig = {
        rules: {},
        exceptions: {},
      };
      const results = scan([testData], ruleConfig);
      const scanResults = results.pop();

      expect(
        scanResults?.ruleResults.some((rule) => rule.ruleName === "RecursiveAfterUpdate")
      ).toBeFalsy();
    });

    it("should trigger from when opt-in", () => {
      const testData: ParsedFlow = {
        flow: {
          start: { recordTriggerType: "CreateAndUpdate", triggerType: "RecordAfterSave" },
          elements: [
            {
              subtype: "recordUpdates",
              metaType: "node",
              element: {
                inputReference: "$Record",
              },
            },
          ],
          type: "AutoLaunchedFlow",
        },
      } as Partial<ParsedFlow> as ParsedFlow;
      const ruleConfig = {
        rules: {
          RecursiveAfterUpdate: {
            severity: "warning",
          },
        },
        exceptions: {},
      };
      const results = scan([testData], ruleConfig);
      const scanResults = results.pop();

      expect(
        scanResults?.ruleResults.some((rule) => rule.ruleName === "RecursiveAfterUpdate")
      ).toBeTruthy();
      expect(
        scanResults?.ruleResults?.find((rule) => rule.ruleName === "RecursiveAfterUpdate")?.occurs
      ).toBeTruthy();
    });
  });

  describe("units", () => {
    describe("when using inputReference as $Record", () => {
      it("should trigger when matching record input reference", () => {
        const testData: ParsedFlow = {
          flow: {
            start: { recordTriggerType: "CreateAndUpdate", triggerType: "RecordAfterSave" },
            elements: [
              {
                subtype: "recordUpdates",
                metaType: "node",
                element: {
                  inputReference: "$Record",
                },
              },
            ],
          },
        } as Partial<ParsedFlow> as ParsedFlow;

        const ruleResult: RuleResult = rule.execute(testData.flow as Flow);
        expect(ruleResult.occurs).toBe(true);
      });

      it("should not trigger when not matching record input reference", () => {
        const testData: ParsedFlow = {
          flow: {
            start: { recordTriggerType: "CreateAndUpdate", triggerType: "RecordAfterSave" },
            elements: [
              {
                subtype: "recordUpdates",
                metaType: "node",
                element: {
                  inputReference: "SomethingElse",
                },
              },
            ],
          },
        } as Partial<ParsedFlow> as ParsedFlow;

        const ruleResult: RuleResult = rule.execute(testData.flow as Flow);
        expect(ruleResult.occurs).toBe(false);
      });
    });

    describe("when using inputReference as lookup element", () => {
      it("should trigger when inferred type matches inputReference", () => {
        const testData: ParsedFlow = {
          flow: {
            start: {
              recordTriggerType: "CreateAndUpdate",
              triggerType: "RecordAfterSave",
              object: "Case",
            },
            elements: [
              {
                subtype: "recordLookups",
                metaType: "node",
                element: {
                  object: "Case",
                },
                name: "lookupElement",
              },
              {
                subtype: "recordUpdates",
                metaType: "node",
                element: {
                  inputReference: "lookupElement",
                },
              },
            ],
          },
        } as Partial<ParsedFlow> as ParsedFlow;

        const ruleResult: RuleResult = rule.execute(testData.flow as Flow);
        expect(ruleResult.occurs).toBe(true);
      });

      it("should not trigger when no matching inferred reference", () => {
        const testData: ParsedFlow = {
          flow: {
            start: {
              recordTriggerType: "CreateAndUpdate",
              triggerType: "RecordAfterSave",
              object: "Case",
            },
            elements: [
              {
                subtype: "recordLookups",
                metaType: "node",
                element: {
                  object: "Case",
                },
                name: "lookupElement",
              },
              {
                subtype: "recordUpdates",
                metaType: "node",
                element: {
                  inputReference: "SomethingElse",
                },
              },
            ],
          },
        } as Partial<ParsedFlow> as ParsedFlow;

        const ruleResult: RuleResult = rule.execute(testData.flow as Flow);
        expect(ruleResult.occurs).toBe(false);
      });
    });
  });
});
