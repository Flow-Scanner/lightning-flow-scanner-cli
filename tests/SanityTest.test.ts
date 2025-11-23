import * as core from "../src";

test("core exports sanity", () => {
  expect(core.scan).toBeDefined();
  expect(core.parse).toBeDefined();
});