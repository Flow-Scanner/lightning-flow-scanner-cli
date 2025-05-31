import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["umd", "cjs"],
      name: "lightningflowscanner",
    },
    minify: true,
    rollupOptions: {
      external: ["xmlbuilder2"],
      output: {
        globals: {
          fs: "fs",
          path: "path",
          xmlbuilder2: "xmlbuilder2",
        },
      },
    },
    ssr: false,
  },
  plugins: [nodePolyfills({ include: ["path", "fs"], protocolImports: true })],

  resolve: { alias: { src: resolve("src/") } },
});
