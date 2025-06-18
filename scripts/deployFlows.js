const { spawnSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);
const orgFlagIndex = args.findIndex(arg => arg === "-o" || arg === "--target-org");
const targetOrg = (orgFlagIndex !== -1 && args[orgFlagIndex + 1]) || process.env.SF_TARGET_ORG;

if (!targetOrg) {
  console.error("❌ Missing org alias. Use -o <alias> or set SF_TARGET_ORG.");
  process.exit(1);
}

const projectDir = path.join(__dirname, "../example-flows");
const sourceDir = "force-app";

console.log(`📦 Deploying flows from ${projectDir}/${sourceDir} to org: ${targetOrg}`);

const result = spawnSync(
  "sf",
  ["project", "deploy", "start", "--source-dir", sourceDir, "--target-org", targetOrg],
  { cwd: projectDir, shell: true, stdio: "inherit" }
);

if (result.status !== 0) {
  console.error(`❌ Deployment failed (exit code ${result.status})`);
  process.exit(result.status);
}

console.log("✅ Deployment completed.");
