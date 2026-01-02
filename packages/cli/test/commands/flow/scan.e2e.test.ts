import { expect } from "chai";
import { Config } from "@oclif/core";
import Scan from "../../../src/commands/flow/scan.js";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Scan E2E Tests", () => {
  let config: Config;
  const demoFlowsPath = path.resolve(__dirname, "../../../../../example-flows/force-app/demo");

  before(async () => {
    config = await Config.load(import.meta.url);
  });

  describe("Demo Flow Scanning", () => {
    it("should scan all demo flows and find violations", async () => {
      const output = await new Scan(["-d", demoFlowsPath], config).run();

      expect(output.summary.results).to.be.equal(output.summary.flowsNumber, "Should find as many violations as flows scanned");
      expect(output.status).to.equal(1, "Should exit with error status due to violations");
    });
  });

});
