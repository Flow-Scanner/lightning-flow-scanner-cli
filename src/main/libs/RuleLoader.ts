import IRuleDefinition from "../interfaces/IRuleDefinition";

export class RuleLoader {
    static loadCustomRule(filePath: string): IRuleDefinition | undefined {
        try {
            // Synchronously load the module based on the provided file path
            const module = require(filePath);

            // Check if the module contains a CustomFlowName property
            if (module.CustomFlowName && typeof module.CustomFlowName === 'function') {
                // Create an instance of the CustomFlowName class
                const customRuleInstance = new module.CustomFlowName();
                return customRuleInstance as IRuleDefinition;
            } else {
                // Handle case where module does not contain CustomFlowName
                console.error(`Error: ${filePath} does not export CustomFlowName class.`);
                return undefined;
            }
        } catch (error) {
            // Handle import errors
            console.error(`Error importing ${filePath}:`, error);
            return undefined;
        }
    }
}
