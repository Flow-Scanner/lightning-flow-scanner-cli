import {Flow} from "../models/Flow";
import {Rule} from "../models/Rule";
import * as rules from "../data/rules.json";

export class MissingFlowDescription extends Rule{

    constructor(
    ) {
      const rule = rules.rules.find(rule => rule.name === "MissingFlowDescription");
      super(rule.name, rule.label, rule.text);
    }

    public execute(flow: Flow) {
        return !flow.xmldata.Flow.description;
    }
}
