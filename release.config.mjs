/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [{ name: "master", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
