import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {RuleResult} from '../models/RuleResult';
import { RulesConfig } from '../models/RulesConfig';
import {ScanResult} from '../models/ScanResult';
import {GetRuleDefinitions} from './GetRuleDefinitions';

export function ScanFlows(flows: Flow[], rulesConfig?: RulesConfig): ScanResult[] {

  const flowResults: ScanResult[] = [];
  let selectedRules: IRuleDefinition[];
  if (rulesConfig) {
    // filter names
    selectedRules = GetRuleDefinitions();
  } else {
    selectedRules = GetRuleDefinitions();
  }
  for (const flow of flows) {
    const ruleResults: RuleResult[] = [];
    for (const rule of selectedRules) {
      let severity = "error";

      //todo check severity confnig for flow

      if(rule.supportedTypes.includes(flow.type[0])) {
        try {
          ruleResults.push(rule.execute(flow));
        } catch (error) {
          ruleResults.push(new RuleResult( true, rule.name, severity,'error', [error]));
        }
      }
    }
    flowResults.push(new ScanResult(flow, ruleResults));
  }
  return flowResults;
}
