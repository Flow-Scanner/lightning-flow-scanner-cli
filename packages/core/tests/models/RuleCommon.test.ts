import { describe, expect, it } from "@jest/globals";
import { ruleRegistry } from "../../src/main/store/RuleRegistry";

describe("RuleCommon automatically sets isConfigurable correctly", () => {
  it("isConfigurable=true only when check() actually uses options", () => {
    // Get all rule classes (including beta, since the test should cover everything)
    const allRuleIds = ruleRegistry.getAllRuleIds(true);

    for (const ruleId of allRuleIds) {
      const ruleInstance = ruleRegistry.createInstance(ruleId);

      const checkSource = (ruleInstance as any).check.toString();
      const usesOptions = /options[.\?]/.test(checkSource);

      expect(ruleInstance.isConfigurable).toBe(usesOptions);

      if (ruleInstance.isConfigurable !== usesOptions) {
        console.log(`\nMISMATCH on rule: ${ruleInstance.name} (${ruleId})`);
        console.log(`   isConfigurable = ${ruleInstance.isConfigurable}`);
        console.log(`   source ${usesOptions ? "DOES" : "does NOT"} use options`);
        console.log(`   check() source:\n${checkSource}\n`);
      }
    }
  });

  it("known configurable rules have isConfigurable=true", () => {
    const cyclomatic = ruleRegistry.createInstance("excessive-cyclomatic-complexity");
    const flowName = ruleRegistry.createInstance("invalid-naming-convention");

    expect(cyclomatic.isConfigurable).toBe(true);
    expect(flowName.isConfigurable).toBe(true);
  });

  it("known non-configurable rules have isConfigurable=false", () => {
    const duplicateDml = ruleRegistry.createInstance("duplicate-dml");
    const autoLayout = ruleRegistry.createInstance("missing-auto-layout");

    expect(duplicateDml.isConfigurable).toBe(false);
    expect(autoLayout.isConfigurable).toBe(false);
  });
});