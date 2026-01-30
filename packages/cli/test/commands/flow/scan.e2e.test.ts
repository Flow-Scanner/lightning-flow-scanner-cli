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

      // Should find flows and violations (exact count depends on config categories)
      expect(output.summary.flowsNumber).to.be.greaterThan(0, "Should find flows to scan");
      expect(output.summary.results).to.be.greaterThan(0, "Should find violations");
    });
  });

  describe("Ignore Configuration", () => {
    it("should load ignore patterns from .flow-scanner.yml and exclude testing flows", async () => {
      // Scan from project root - should load .flow-scanner.yml which has ignore: ["**/testing/**"]
      const output = await new Scan(["-d", projectRoot], config).run();

      // Should find 22 flows from demo directory (not 51 which would include testing)
      expect(output.summary.flowsNumber).to.equal(22, "Should only scan demo flows, excluding testing directory based on ignore config");
      // Number of results depends on which categories are configured in root config
      expect(output.summary.results).to.be.greaterThan(0, "Should find violations in demo flows");
    });

    it("should load ignore patterns when scanning from example-flows directory", async () => {
      // Scan from example-flows - should still respect root .flow-scanner.yml
      const output = await new Scan(["-d", exampleFlowsPath], config).run();

      // Should find 22 flows from demo (29 flows exist in testing but should be ignored)
      expect(output.summary.flowsNumber).to.equal(22, "Should only scan demo flows, excluding testing directory");
    });
  });

  describe("Category Filtering", () => {
    // Demo flows contain violations for each category:
    // - problem: DML_Statement_In_A_Loop, SOQL_Query_In_A_Loop, Hardcoded_Id, Hardcoded_Url,
    //            Missing_Fault_Path, Missing_Null_Handler_Simple, Unsafe_Running_Context,
    //            Duplicate_DML_Operation, Recursive_After_Update
    // - suggestion: Action_Call_In_A_Loop, Invalid_API_Version, Excessive_Cyclomatic_Complexity,
    //              Get_Records_Stores_All_Fields, Inactive_Flow, Missing_Trigger_Order, Same_Record_Field_Updates
    // - layout: FlowNamingConvention, Missing_Flow_Description, Unclear_API_Name,
    //           Missing_Auto_Layout, Unreachable_Element, Unused_Variable

    it("should only report problem category violations when --categories problem is used", async () => {
      const output = await new Scan(["-d", demoFlowsPath, "--categories", "problem"], config).run();

      // Verify we got results
      expect(output.summary.results).to.be.greaterThan(0, "Should find problem violations");

      // Problem rules: dml-in-loop, soql-in-loop, hardcoded-id, hardcoded-url, missing-fault-path,
      // missing-null-handler, unsafe-running-context, duplicate-dml, recursive-record-update
      const problemRuleIds = [
        "dml-in-loop",
        "soql-in-loop",
        "hardcoded-id",
        "hardcoded-url",
        "missing-fault-path",
        "missing-null-handler",
        "unsafe-running-context",
        "duplicate-dml",
        "recursive-record-update"
      ];

      // All results should be from problem category rules
      for (const result of output.results) {
        expect(problemRuleIds).to.include(
          result.ruleId,
          `Expected only problem rules but found ${result.ruleId}`
        );
      }
    });

    it("should only report suggestion category violations when --categories suggestion is used", async () => {
      const output = await new Scan(["-d", demoFlowsPath, "--categories", "suggestion"], config).run();

      // Verify we got results
      expect(output.summary.results).to.be.greaterThan(0, "Should find suggestion violations");

      // Suggestion rules: action-call-in-loop, invalid-api-version, excessive-cyclomatic-complexity,
      // get-record-all-fields, inactive-flow, unspecified-trigger-order, same-record-field-updates
      const suggestionRuleIds = [
        "action-call-in-loop",
        "invalid-api-version",
        "excessive-cyclomatic-complexity",
        "get-record-all-fields",
        "inactive-flow",
        "unspecified-trigger-order",
        "same-record-field-updates"
      ];

      // All results should be from suggestion category rules
      for (const result of output.results) {
        expect(suggestionRuleIds).to.include(
          result.ruleId,
          `Expected only suggestion rules but found ${result.ruleId}`
        );
      }
    });

    it("should only report layout category violations when --categories layout is used", async () => {
      const output = await new Scan(["-d", demoFlowsPath, "--categories", "layout"], config).run();

      // Verify we got results
      expect(output.summary.results).to.be.greaterThan(0, "Should find layout violations");

      // Layout rules: invalid-naming-convention, missing-flow-description, unclear-api-naming,
      // missing-auto-layout, unreachable-element, unused-variable
      const layoutRuleIds = [
        "invalid-naming-convention",
        "missing-flow-description",
        "unclear-api-naming",
        "missing-auto-layout",
        "unreachable-element",
        "unused-variable"
      ];

      // All results should be from layout category rules
      for (const result of output.results) {
        expect(layoutRuleIds).to.include(
          result.ruleId,
          `Expected only layout rules but found ${result.ruleId}`
        );
      }
    });

    it("should support multiple categories with space-separated values", async () => {
      const output = await new Scan([
        "-d", demoFlowsPath,
        "-g", "problem", "suggestion"
      ], config).run();

      // Verify we got results from both categories
      expect(output.summary.results).to.be.greaterThan(0, "Should find violations");

      // Should NOT include layout rules
      const layoutRuleIds = [
        "invalid-naming-convention",
        "missing-flow-description",
        "unclear-api-naming",
        "missing-auto-layout",
        "unreachable-element",
        "unused-variable"
      ];

      for (const result of output.results) {
        expect(layoutRuleIds).to.not.include(
          result.ruleId,
          `Should not include layout rule ${result.ruleId}`
        );
      }
    });

    it("should support multiple categories with repeated flag", async () => {
      const output = await new Scan([
        "-d", demoFlowsPath,
        "-g", "problem",
        "-g", "suggestion"
      ], config).run();

      // Verify we got results from both categories
      expect(output.summary.results).to.be.greaterThan(0, "Should find violations");

      // Should NOT include layout rules
      const layoutRuleIds = [
        "invalid-naming-convention",
        "missing-flow-description",
        "unclear-api-naming",
        "missing-auto-layout",
        "unreachable-element",
        "unused-variable"
      ];

      for (const result of output.results) {
        expect(layoutRuleIds).to.not.include(
          result.ruleId,
          `Should not include layout rule ${result.ruleId}`
        );
      }
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
