import { describe, it, expect } from "@jest/globals";
import { getBetaRules } from "../../src/main/libs/GetRuleDefinitions";
import { getBetaRules as getBetaRulesExported } from "../../src/index";
import { BetaRuleStore } from "../../src/main/store/DefaultRuleStore";

describe("GetRuleDefinitions", () => {
  describe("getBetaRules", () => {
    it("should be defined", () => {
      expect(getBetaRules).toBeDefined();
    });

    it("should return an array of rule definitions", () => {
      const rules = getBetaRules();
      expect(rules).toBeInstanceOf(Array);
    });

    test.each(getBetaRules())(
      "should match a beta rule name $name severity $severity",
      ({ name }) => {
        expect(BetaRuleStore).toHaveProperty(name);
      }
    );
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
});
