import {ScanResult} from "../models/ScanResult";
import {FlowScanOverrides} from "../models/FlowScanOverrides";

export function ApplyOverrides(scanResults: ScanResult[], overrides: FlowScanOverrides[]): ScanResult[] {

  for (const scanResult of scanResults) {
    let scanOverrides = overrides.find(flowOverride => {
      if (flowOverride.flowName === scanResult.flow.label[0]) {
        return flowOverride;
      }
    });

    if (scanOverrides) {
      for (const rule of scanResult.ruleResults) {
        if (rule.details) {
          for (const result of rule.details) {
            let override;
            override = scanOverrides.results.find(o => (
              o.ruleName === rule.ruleName && o.result === result.name)
            );
            if (override) {
              rule.details = rule.details.filter(result => result.name !== override.result);
              if(rule.details.length === 0){
                rule.occurs = false;
              }
            }
          }
        } else {
          rule.occurs = false;
        }
      }
    }
  }

  return scanResults;
}
