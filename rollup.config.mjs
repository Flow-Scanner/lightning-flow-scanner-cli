import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "umd",
      name: "lightningflowscanner",
      sourcemap: true,
      globals: {
        "path-browserify": "p",
        xmlbuilder2: "xmlbuilder2",
      },
    }
  ],
  plugins: [
    nodePolyfills(),
    typescript({tsconfig: `tsconfig.umd.json`}),
    nodeResolve({ preferBuiltins: true }),
    nodePolyfills(),
  ],
  external: ["path-browserify", "xmlbuilder2"],
};
