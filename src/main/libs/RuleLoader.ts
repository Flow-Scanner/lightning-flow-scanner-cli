import IRuleDefinition from "../interfaces/IRuleDefinition";
import { RuleParser } from "./RuleParser";

export class RuleLoader {
    static loadCustomRule(filePath: string): IRuleDefinition | undefined {

        // todo verify attributes & method
        // return RuleParser.parseRuleFile(filePath);
        const externalRule: any = require(filePath);
        const customRuleInstance = new externalRule() as IRuleDefinition;
        return customRuleInstance;
    }
}