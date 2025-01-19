import globals from "globals";
// import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginJest from "eslint-plugin-jest";

export default [
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  // pluginJs.configs.recommended,
  {
    files: ["tests/*.test.ts"],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
];
