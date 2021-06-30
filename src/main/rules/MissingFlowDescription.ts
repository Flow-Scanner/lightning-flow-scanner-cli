import * as rules from '../config/rules.json';
import {Flow} from '../models/Flow';
import {FlowResult} from '../models/FlowResult';
import {Rule} from '../models/Rule';

export class MissingFlowDescription extends Rule{

    constructor(
    ) {
      const rule = rules.rules.find(rule => rule.name === 'MissingFlowDescription');
      super(rule.name, rule.label, rule.text);
    }

    public execute(flow: Flow) {
      return new FlowResult('MissingFlowDescription', 'flow', [!flow.xmldata.Flow.description]);
    }
}
