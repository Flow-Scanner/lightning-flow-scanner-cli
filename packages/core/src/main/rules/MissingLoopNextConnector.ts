import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../internals/internals"; 

export class MissingLoopNextConnector extends RuleCommon implements IRuleDefinition{

    constructor() {
      super({
        ruleId: "missing-loop-next-connector",
        category: "layout",
        name: "MissingLoopNextConnector",
        label: "Missing Loop Next Connector",
        description: "When a flow loop has no next connector.",
        summary: "Ensure flow has a next connector",
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

        const variables = flow.elements?.filter(
            (e) => e.subtype === "loops"
        ) as core.FlowVariable[];


        for(const variable of variables){

            const varElement = variable.element as any;
            if(varElement.nextValueConnector==null){
                violations.push(
                    new core.Violation(variable)
                );
            }
        }
        return violations;
    }

}