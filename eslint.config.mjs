import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const recommendedConfigs = [...tseslint.configs.recommended]
  .filter((config) => config.name === "@typescript-eslint/no-unused-expressions")
  .concat({
    name: "@typescript-eslint/no-unused-expressions",
    files: ["./tests/*.test.ts"],
    rules: {
      "no-unused-expressions": "off",
    },
  });

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...recommendedConfigs,
];
