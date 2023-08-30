import * as IdPrefixes from '../data/IdPrefixes.json';
import { IRuleDefinition } from '../interfaces/IRuleDefinition';
import { Flow } from '../models/Flow';
import { FlowType } from '../models/FlowType';
import { RuleResult } from '../models/RuleResult';
import { RuleCommon } from '../models/RuleCommon';

export class HardcodedIds extends RuleCommon implements IRuleDefinition {

  constructor() {
    super({
      name: 'HardcodedIds',
      label: 'Hardcoded Ids',
      description: 'IDs are org-specific, so don’t hard-code IDs. Instead, pass them into variables when the flow starts. You can do so, for example, by using merge fields in URL parameters or by using a Get Records element.',
      type: 'pattern',
      supportedFlowTypes: FlowType.allTypes,
      docRefs: [{ 'label': 'Flow Best Practices', 'path': 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }, {'label' : "Don't hard code Record Type IDs in Flow. By Stephen Church.", 'path' : 'https://www.linkedin.com/feed/update/urn:li:activity:6947530300012826624/?updateEntityUrn=urn%3Ali%3Afs_feedUpdate%3A%28V2%2Curn%3Ali%3Aactivity%3A6947530300012826624%29'}]
    },
    );
  }

  public execute(flow: Flow): RuleResult {
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
    return new RuleResult(this, nodesWithHardcodedIds.length > 0, nodesWithHardcodedIds);
  }
}