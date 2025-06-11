import { beforeEach } from "@jest/globals";

beforeEach(() => {
  process.env.IS_NEW_SCAN_ENABLED = "true";
  process.env.OVERRIDE_CONFIG = "true";
});
