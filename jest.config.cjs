/** @type {import('jest').Config} */
module.exports = {
  automock: false,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov"],
  modulePathIgnorePatterns: ["./jest.config.cjs", "./out/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc-node/jest",
      {
        module: "commonjs",
        swc: { minify: false, sourceMaps: "inline" },
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};