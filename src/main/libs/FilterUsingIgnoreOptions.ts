import {RuleOptions} from "../models/RuleOptions";
import {ScanResult} from "../models/ScanResult";

export function FilterUsingIgnoreOptions(scanResults: ScanResult[], ruleOptions: RuleOptions): ScanResult[] {

  const ruleSettings = ruleOptions.ruleSettings;
  const overrides = ruleOptions.overrides;
  let deactivatedRules: string[] = [];
  for (const ruleSetting of ruleSettings) {
    if (ruleSetting.level === 'off') {
      deactivatedRules.push(ruleSetting.name);
    }
  }
  let filteredScanResults;
  for (const scanResult of scanResults) {
    if (scanResult.ruleResults.filter(ruleResult => {
      if (!deactivatedRules.includes(ruleResult.ruleName)) {
        return ruleResult;
      }
    })) {
      filteredScanResults.push(scanResult);
    }

    // todo check overrides
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
