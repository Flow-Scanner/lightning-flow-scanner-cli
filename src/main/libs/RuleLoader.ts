import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { RuleParser } from "./RuleParser";

export class RuleLoader {
    static loadCustomRule(filePath: string): IRuleDefinition | undefined {
        return RuleParser.parseRuleFile(filePath);
    }
}
