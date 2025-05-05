import { describe, it, expect } from "@jest/globals";
import { getBetaRules, getRules } from "../../src/main/libs/GetRuleDefinitions";
import {
  getBetaRules as getBetaRulesExported,
  getRules as getRulesExported,
} from "../../src/index";
import { BetaRuleStore, DefaultRuleStore } from "../../src/main/store/DefaultRuleStore";

describe("GetRuleDefinitions", () => {
  describe("getBetaRules", () => {
    it("should be defined", () => {
      expect(getBetaRules).toBeDefined();
    });

    it("should return an array of rule definitions", () => {
      const rules = getBetaRules();
      expect(rules).toBeInstanceOf(Array);
    });

    test.each(getBetaRules())("should match a beta rule $name severity $severity", ({ name }) => {
      expect(BetaRuleStore).toHaveProperty(name);
    });
  });

  describe("getBetaRules exported", () => {
    it("should be defined", () => {
      expect(getBetaRulesExported).toBeDefined();
    });

    it("should return an array of rule definitions", () => {
      const rules = getBetaRulesExported();
      expect(rules).toBeInstanceOf(Array);
    });

    test.each(getBetaRulesExported())(
      "should match a beta rule name $name severity $severity",
      ({ name }) => {
        expect(BetaRuleStore).toHaveProperty(name);
      }
    );
  });

  describe("getRules", () => {
    it("should be defined", () => {
      expect(getRules).toBeDefined();
    });

    it("should return an array of rule definitions", () => {
      const rules = getRules();
      expect(rules).toBeInstanceOf(Array);
    });

    test.each(getRules())("should match a rule name $name", ({ name }) => {
      expect(DefaultRuleStore).toHaveProperty(name);
    });
  });

  describe("getRules exported", () => {
    it("should be defined", () => {
      expect(getRulesExported).toBeDefined();
    });

    it("should return an array of rule definitions", () => {
      const rules = getRulesExported();
      expect(rules).toBeInstanceOf(Array);
    });

    test.each(getRulesExported())("should match a rule name $name", ({ name }) => {
      expect(DefaultRuleStore).toHaveProperty(name);
    });
  });
});
