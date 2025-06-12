import * as p from "path";

import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class RuleLoader {
  static loadCustomRule(ruleName: string, filePath: string): IRuleDefinition | undefined {
    try {
      // Resolve the filePath to an absolute path relative to the current working directory

      const absolutePath = p.resolve(process.cwd(), filePath);

      // Synchronously load the module based on the absolute file path
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module = require(absolutePath);

      // Check if the module exports the given rule
      if (module[ruleName] && typeof module[ruleName] === "function") {
        // Create an instance of the rule class
        const customRuleInstance = new module[ruleName]();
        return customRuleInstance as IRuleDefinition;
      } else {
        // Handle case where module does not contain CustomFlowName
        console.error(`Error: ${filePath} does not export ${ruleName} class.`);
        return undefined;
      }
    } catch (error) {
      // Handle import errors
      console.error(`Error importing ${filePath}:`, error);
      return undefined;
    }
  }
}
