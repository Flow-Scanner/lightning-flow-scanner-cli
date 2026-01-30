// scripts/publish-action-tag.js  ← SAVE HERE IN ROOT
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// This is the ONLY path that works in your fresh clone
const pkgPath = path.join(__dirname, '../..', 'packages', 'action', 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('ERROR: Cannot find packages/action/package.json');
  console.error('Expected path:', pkgPath);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const tag = `action-v${version}`;
console.log(`Checking action tag: ${tag}`);

// Check if tag exists locally
let localTagExists = false;
try {
  execSync(`git rev-parse "${tag}"`, { stdio: 'ignore' });
  localTagExists = true;
} catch (_) {}

// Check if tag exists on remote
let remoteTagExists = false;
try {
  execSync(`git ls-remote --tags origin "refs/tags/${tag}"`, { stdio: 'pipe' }).toString().trim();
  const result = execSync(`git ls-remote --tags origin "refs/tags/${tag}"`, { encoding: 'utf8' }).trim();
  remoteTagExists = result.length > 0;
} catch (_) {}

if (localTagExists || remoteTagExists) {
  console.error(`\nERROR: Tag "${tag}" already exists!`);
  console.error(`  - Local: ${localTagExists ? 'YES' : 'no'}`);
  console.error(`  - Remote: ${remoteTagExists ? 'YES' : 'no'}`);
  console.error(`\nTo publish a new action version:`);
  console.error(`  1. Update version in packages/action/package.json`);
  console.error(`  2. Run this script again`);
  console.error(`\nTo force overwrite (not recommended), delete the tag first:`);
  console.error(`  git tag -d "${tag}" && git push origin :refs/tags/${tag}`);
  process.exit(1);
}

try {
  // Create tag
  execSync(`git tag "${tag}"`, { stdio: 'inherit' });
  // Push tag
  execSync(`git push origin "${tag}"`, { stdio: 'inherit' });
  console.log(`\n${tag} created and pushed successfully!`);
} catch (err) {
  console.error('Failed to create tag:', err.message);
  process.exit(1);
}