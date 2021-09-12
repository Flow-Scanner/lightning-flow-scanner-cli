import {RuleOptions} from "../models/RuleOptions";
import {ScanResult} from "../models/ScanResult";
import {RuleOption} from "../models/RuleOption";
import createLogger from 'logging';

export function FilterUsingIgnoreOptions(scanResults: ScanResult[], ruleOptions: RuleOptions): ScanResult[] {

  const logger = createLogger('FeatureName');

  const ruleSettings = ruleOptions.ruleSettings;
  let deactivatedRules: string[] = [];
  for (const ruleSetting of ruleSettings) {
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
      filteredScanResults.push(new ScanResult(scanResult.flow, scanResult.ruleResults.filter(ruleResult => {
        if (!deactivatedRules.includes(ruleResult.ruleName)) {
          return ruleResult;
        }
        else {
          ruleResult.results = [];
          return ruleResult;
        }
      })));
    }

    // todo check overrides
    const overrides = ruleOptions.overrides;

  }

  return filteredScanResults;
}
