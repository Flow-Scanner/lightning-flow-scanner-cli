import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: "src/index.ts",
    output: {
        dir: "out",
        format: 'umd',
        name: 'lightningflowscanner',
        sourcemap: true,
        globals: {
            "path-browserify": "p",
            xmlbuilder2: "xmlbuilder2"
        }
    },
    plugins: [nodePolyfills(), typescript(), nodeResolve({preferBuiltins:true}), nodePolyfills()],
    external: ["path-browserify", "xmlbuilder2"]
}