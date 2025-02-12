import { describe, it, expect, jest } from "@jest/globals";
import * as xmlbuilder from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

import { Flow } from "../../src/main/models/Flow";

describe("Flow Model", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => jest.fn());
  });

  it("should print as xml when correct parameters", () => {
    const sut: Flow = new Flow('flow A');
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
    const sut: Flow = new Flow('flow B');
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
    const sut: Flow = new Flow('flow C');
    const errors = getError(sut["generateDoc"]);
    expect(errors).toBeTruthy();
    expect(errors).not.toBeInstanceOf(NoErrorThrownError);
  });
});
