import * as core from "../src";

test("core exports sanity", () => {
  console.log(Object.keys(core));
  expect(core.scan).toBeDefined();
  expect(core.parse).toBeDefined();
});