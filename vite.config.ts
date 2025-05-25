import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["umd"],
      name: "lightningflowscanner",
    },
    minify: true,
    rollupOptions: {
      external: ["xmlbuilder2"],
      output: {
        globals: {
          xmlbuilder2: "xmlbuilder2",
        },
      },
    },
  },
  plugins: [nodePolyfills()],

  resolve: { alias: { src: resolve("src/") } },
});
