import {RuleOptions} from "../models/RuleOptions";
import {ScanResult} from "../models/ScanResult";
import {RuleOption} from "../models/RuleOption";

export function FilterUsingIgnoreOptions(scanResults: ScanResult[], ruleOptions: RuleOptions): ScanResult[] {

  const ruleSettings = ruleOptions.ruleSettings;
  let deactivatedRules: string[] = [];
  for (const ruleSetting : RuleOption of ruleSettings) {
    if (ruleSetting.level === 'off') {
      deactivatedRules.push(ruleSetting.name);
    }
  }
  let filteredScanResults = [];
  for (const scanResult of scanResults) {
    if (scanResult.ruleResults.filter(ruleResult => {
      if (!deactivatedRules.includes(ruleResult.ruleName)) {
        return ruleResult;
      }
    })) {
      filteredScanResults.push(scanResult);
    }

    // todo check overrides
    const overrides = ruleOptions.overrides;

  }

  return filteredScanResults;
}

// {
//   "rules": {
//   "rule1": "error",
//     "rule2": "off"
// },
//   "overrides": [
//   {
//     "flowName": "myFlow1",
//     "rules": {
//       "rule1": "off"
//     }
//   }
// ]
// }
