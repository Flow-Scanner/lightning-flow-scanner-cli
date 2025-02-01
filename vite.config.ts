import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [nodePolyfills()],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["umd"],
      name: "lightningflowscanner",
    },
    rollupOptions: {
      external: ["xmlbuilder2"],
      output: {
        globals: {
          xmlbuilder2: "xmlbuilder2",
        },
      },
    },
  },

  resolve: { alias: { src: resolve("src/") } },
});
