import * as IdPrefixes from '../data/IdPrefixes.json';
import {IRuleDefinition} from '../interfaces/IRuleDefinition';
import {Flow} from '../models/Flow';
import {FlowType} from '../models/FlowType';
import {RuleResult} from '../models/RuleResult';
import {RuleDefinitions} from '../definitions/RuleDefinitions';
import {RuleCommon} from './RuleCommon';

export class HardcodedIds extends RuleCommon implements IRuleDefinition{

  constructor() {
    super(RuleDefinitions.HardcodedIds, FlowType.allTypes,[{'label': 'Flow Best Practices', 'path':'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5'}]);
  }

  public execute(flow: Flow) : RuleResult {
    const prefixes = IdPrefixes.ids.map(prefix => {
      return prefix['Key Prefix'];
    });
    const nodesWithHardcodedIds = [];
    const customPrefixes = new Array(100);
    for (let i = 0; i < customPrefixes.length; i++) {
      const prefix = ('' + i).length === 1 ? 'a0' + String(i) : 'a' + String(i);
      prefixes.push(prefix);
    }
    for (const prefix of prefixes) {
      const match18charIds: RegExp = new RegExp('\\b' + prefix + '\\w{15}\\b');
      const match15charIds: RegExp = new RegExp('\\b' + prefix + '\\w{12}\\b');

      for (const node of flow.nodes) {
        const nodeString = JSON.stringify(node);
        const hardcodedIdsL18 = nodeString.match(match18charIds);
        const hardcodedIdsL15 = nodeString.match(match15charIds);

        if (hardcodedIdsL15 || hardcodedIdsL18) {
          nodesWithHardcodedIds.push(node);
        }
      }
    }
    return new RuleResult( nodesWithHardcodedIds.length > 0, this.name, 'pattern', nodesWithHardcodedIds);
  }
}
