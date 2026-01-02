import { expect } from "chai";
import { Config } from "@oclif/core";
import Scan from "../../../src/commands/flow/scan.js";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Scan E2E Tests", () => {
  let config: Config;
  const demoFlowsPath = path.resolve(__dirname, "../../../../../example-flows/force-app/demo");
  const exampleFlowsPath = path.resolve(__dirname, "../../../../../example-flows");
  const projectRoot = path.resolve(__dirname, "../../../../..");

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

  describe("Ignore Configuration", () => {
    it("should load ignore patterns from .flow-scanner.yml and exclude testing flows", async () => {
      // Scan from project root - should load .flow-scanner.yml which has ignore: ["**/testing/**"]
      const output = await new Scan(["-d", projectRoot], config).run();

      // Should find 22 flows from demo directory (not 51 which would include testing)
      expect(output.summary.flowsNumber).to.equal(22, "Should only scan demo flows, excluding testing directory based on ignore config");
      expect(output.summary.results).to.equal(22, "Should find violations in demo flows");
    });

    it("should load ignore patterns when scanning from example-flows directory", async () => {
      // Scan from example-flows - should still respect root .flow-scanner.yml
      const output = await new Scan(["-d", exampleFlowsPath], config).run();

      // Should find 22 flows from demo (29 flows exist in testing but should be ignored)
      expect(output.summary.flowsNumber).to.equal(22, "Should only scan demo flows, excluding testing directory");
    });
  });

  describe("Ignore Flow Names", () => {
    it("should exclude flows by API name using ignoreFlows", async () => {
      // Scan demo flows but exclude specific flow names
      // We'll use the --config flag to create a temporary config with ignoreFlows
      const tempConfigPath = path.resolve(__dirname, "../../../temp-test-config.yml");
      const fs = await import('fs');

      // Create temp config with ignoreFlows
      fs.writeFileSync(tempConfigPath, `
ignoreFlows:
  - "Hardcoded_Id"
  - "Hardcoded_Url"
rules: {}
`);

      try {
        const output = await new Scan(["-d", demoFlowsPath, "--config", tempConfigPath], config).run();

        // Should find 20 flows (22 demo flows - 2 ignored by name)
        expect(output.summary.flowsNumber).to.equal(20, "Should exclude flows specified in ignoreFlows");

        // Verify the ignored flows are not in results
        const flowNames = new Set(output.results.map(r => r.flowApiName));
        expect(flowNames.has("Hardcoded_Id")).to.be.false;
        expect(flowNames.has("Hardcoded_Url")).to.be.false;
      } finally {
        // Clean up temp config
        if (fs.existsSync(tempConfigPath)) {
          fs.unlinkSync(tempConfigPath);
        }
      }
    });

    it("should combine path ignore and flow name ignore", async () => {
      // Create temp config that ignores testing directory AND specific flow names in demo
      const tempConfigPath = path.resolve(__dirname, "../../../temp-test-config2.yml");
      const fs = await import('fs');

      fs.writeFileSync(tempConfigPath, `
ignore:
  - "**/testing/**"
ignoreFlows:
  - "Hardcoded_Id"
rules: {}
`);

      try {
        const output = await new Scan(["-d", exampleFlowsPath, "--config", tempConfigPath], config).run();

        // Should find 21 flows (22 demo flows - 1 ignored by name, testing already excluded by path)
        expect(output.summary.flowsNumber).to.equal(21, "Should apply both path and flow name ignore");

        const flowNames = new Set(output.results.map(r => r.flowApiName));
        expect(flowNames.has("Hardcoded_Id")).to.be.false;
      } finally {
        if (fs.existsSync(tempConfigPath)) {
          fs.unlinkSync(tempConfigPath);
        }
      }
    });
  });

});
