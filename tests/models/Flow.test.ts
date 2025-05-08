import { describe, it, expect, jest } from "@jest/globals";
import * as xmlbuilder from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

import { Flow } from "../../src/main/models/Flow";

describe("Flow Model", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => jest.fn());
  });

  it("should print as xml when correct parameters", () => {
    const sut: Flow = new Flow();
    sut.xmldata = {
      "@xmlns": "http://soap.sforce.com/2006/04/metadata",
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      dynamicChoiceSets: {
        name: "Priority",
        dataType: "Picklist",
        displayField: {
          "@xsi:nil": "true",
        },
        object: {
          "@xsi:nil": "true",
        },
        picklistField: "Priority",
        picklistObject: "Task",
      },
    };
    const out = sut.toXMLString();
    expect(out).toBeTruthy();
    expect(out).toMatch('<displayField xsi:nil="true"/>');
    expect(out).toMatch('<object xsi:nil="true"/>');
  });

  it("should never throw an exception for toXMLString", () => {
    const sut: Flow = new Flow();
    sut.xmldata = { test: "test" };
    jest.spyOn(xmlbuilder, "create").mockReturnValue({
      root: () => ({
        att: () => ({
          end: () => {
            throw "simulated exception";
          },
        }),
      }),
    } as unknown as XMLBuilder);

    const out = sut.toXMLString();
    expect(out).toBeFalsy();
    expect(out).toBe("");
  });

  class NoErrorThrownError extends Error {}
  const getError = (call: () => unknown): Error => {
    try {
      call();
      throw new NoErrorThrownError();
    } catch (error: unknown) {
      return error as Error;
    }
  };

  it("should throw an exception for bad document", async () => {
    const sut: Flow = new Flow();
    const errors = getError(sut["generateDoc"]);
    expect(errors).toBeTruthy();
    expect(errors).not.toBeInstanceOf(NoErrorThrownError);
  });

  it("should identify transformElement as a FlowNode", () => {
    const sut: Flow = new Flow();
    sut.xmldata = {
      transforms: [
        {
          name: "OCR_Mapping",
          description: "OCR Mapping",
          label: "OCR Mapping",
          locationX: "176",
          locationY: "323",
          connector: {
            targetReference: "OCR",
          },
          dataType: "SObject",
          isCollection: "false",
          objectType: "OpportunityContactRole",
          scale: "0",
          transformValues: {
            transformValueActions: [
              {
                outputFieldApiName: "OpportunityId",
                transformType: "Map",
                value: {
                  elementReference: "$Record.Id",
                },
              },
              {
                outputFieldApiName: "ContactId",
                transformType: "Map",
                value: {
                  elementReference: "$Record.ContactId",
                },
              },
              {
                outputFieldApiName: "Role",
                transformType: "Map",
                value: {
                  stringValue: "Decision Maker",
                },
              },
            ],
          },
        },
      ],
    };

    sut["preProcessNodes"]();

    expect(sut.elements).toBeDefined();
    expect(sut.elements).toHaveLength(1);
    const element = sut.elements?.pop();
    expect(element).toBeDefined();
    expect(element).toHaveProperty("name", "OCR_Mapping");
    expect(element?.metaType).toBe("node");
    expect(element?.subtype).toBe("transforms");
  });
});
