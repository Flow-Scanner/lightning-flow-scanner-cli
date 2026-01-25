import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../internals/internals"; 

export class MissingStartReference extends RuleCommon implements IRuleDefinition{
    
    constructor() {
      super({
        ruleId: "missing-start-reference",
        category: "system",
        name: "MissingStartReference",
        label: "Missing Start Reference",
        description: "When a flow has no start reference.",
        summary: "Ensure flow has a start reference node",
        supportedTypes: core.FlowType.allTypes(),
        docRefs: [],
      }, { severity: "error" });
    }
    
    
    protected check(
      flow: core.Flow,
      _options: object | undefined,
      _suppressions: Set<string>
    ): core.Violation[] {
        const violations: core.Violation[] = [];
        if(!flow.startNode){
            violations.push(
                new core.Violation(
                new core.FlowAttribute(
                   "undefined","startNode","startNode"
                )
                )
            );
        }
        return violations;
    }

}