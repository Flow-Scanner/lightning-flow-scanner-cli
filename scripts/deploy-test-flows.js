const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { execSync, spawnSync } = require("child_process");

const flowsDir = path.join(__dirname, "../tests/xmlfiles");
const zipPath = path.join(__dirname, "../deploy.zip");
const apiVersion = "60.0";
// Allow --target-org=myalias or -o myalias
const args = process.argv.slice(2);
const orgFlagIndex = args.findIndex(arg => arg === "--target-org" || arg === "-o");

const targetOrg =
  (orgFlagIndex !== -1 && args[orgFlagIndex + 1]) ||
  process.env.SF_TARGET_ORG;

if (!targetOrg) {
  console.error("❌ Missing org alias. Please provide it with --target-org <alias> or set SF_TARGET_ORG.");
  process.exit(1);
}

// Clean old artifacts
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

// Collect flow files
const flowFiles = fs.readdirSync(flowsDir).filter(f => f.endsWith(".flow-meta.xml"));
if (flowFiles.length === 0) {
  console.error("❌ No .flow-meta.xml files found in tests/xmlfiles.");
  process.exit(1);
}

// Generate package.xml
const packageXml = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
  <types>
    <members>*</members>
    <name>Flow</name>
  </types>
  <version>${apiVersion}</version>
</Package>`;

fs.writeFileSync(path.join(flowsDir, "package.xml"), packageXml);
console.log("✅ package.xml generated");

// Create deploy.zip
const output = fs.createWriteStream(zipPath);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`✅ Created deploy.zip (${archive.pointer()} bytes)`);

  // Deploy using SF CLI
  console.log("🚀 Deploying flows (partial deploy allowed)...");
  
  const deploy = spawnSync("sf", [
    "project", "deploy", "start",
    "--metadata-dir", "deploy.zip",
    "--target-org", targetOrg,
    "--single-package",
    "--ignore-warnings",   // optional
    "--json"               // for clean machine-readable output
  ], { stdio: "pipe", encoding: "utf-8" });

  if (deploy.error) {
    console.error("❌ CLI failed:", deploy.error.message);
    process.exit(1);
  }

  const result = JSON.parse(deploy.stdout);
  const failures = result.result?.details?.componentFailures || [];
  const successes = result.result?.details?.componentSuccesses || [];

  console.log(`\n✅ Deployed: ${Array.isArray(successes) ? successes.length : 1}`);
  if (failures.length) {
    console.warn(`⚠️  Failed to deploy ${failures.length} component(s):\n`);
    failures.forEach(f => {
      console.warn(`❌ ${f.componentType} - ${f.fullName}: ${f.problem}`);
    });
  }

  const status = result.status === 0 ? "✅ Overall Success" : "⚠️ Partial Success";
  console.log(`\n${status}: Deployment ${result.result.status}`);
});

archive.on("error", (err) => { throw err; });
archive.pipe(output);
[...flowFiles, "package.xml"].forEach(file =>
  archive.file(path.join(flowsDir, file), { name: file })
);
archive.finalize();
