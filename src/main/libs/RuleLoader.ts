import IRuleDefinition from "../interfaces/IRuleDefinition";
import path from 'path'; // Import the path module

export class RuleLoader {
    static loadCustomRule(filePath: string): IRuleDefinition | undefined {
        try {
            // Resolve the filePath to an absolute path relative to the current working directory
            const absolutePath = path.resolve(process.cwd(), filePath);

            // Synchronously load the module based on the absolute file path
            const module = require(absolutePath);

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
