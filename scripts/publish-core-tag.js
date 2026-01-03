// scripts/publish-core-tag.js
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Determine repo root (one levels up from script)
const repoRoot = path.resolve(__dirname, '..');
const corePkgPath = path.join(repoRoot, 'packages', 'core', 'package.json');
const lockFilePath = path.join(repoRoot, 'pnpm-lock.yaml');

if (!fs.existsSync(corePkgPath)) {
  console.error('ERROR: Cannot find packages/core/package.json');
  console.error('Expected path:', corePkgPath);
  process.exit(1);
}

// Read version
const pkg = JSON.parse(fs.readFileSync(corePkgPath, 'utf8'));
const version = pkg.version;
const tag = `core-v${version}`;

console.log(`Preparing release tag: ${tag}`);

// Git wrapper — sets cwd to repo root
function git(...args) {
  execFileSync('git', args, { stdio: 'inherit', cwd: repoRoot });
}

try {
  // Check we're on main branch
  const currentBranch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8', cwd: repoRoot }).trim();
  if (currentBranch !== 'main') {
    console.error('❌ This script must be run on the main branch.');
    console.error(`   Current branch: ${currentBranch}`);
    console.error('   Use "node scripts/publish-core-from-branch.js" to publish from a feature branch.');
    process.exit(1);
  }


  // Check for uncommitted changes ONLY in packages/core
  const coreDir = path.join(repoRoot, 'packages', 'core');
  const status = execFileSync('git', ['status', '--porcelain', 'packages/core'], { encoding: 'utf8', cwd: repoRoot }).trim();

  if (status) {
    const allowed = [corePkgPath, lockFilePath]
  .map(p => path.relative(repoRoot, p))
  .map(p => path.normalize(p));

    const modified = status
      .split('\n')
      .map(line => line.replace(/^\s*[MADRCU?!]+\s+/, '').trim())
      .filter(Boolean)
      .map(f => path.normalize(f));

    const unexpected = modified.filter(f => !allowed.includes(f));
    if (unexpected.length > 0) {
      console.error('❌ Uncommitted changes in packages/core not allowed (except package.json):', unexpected);
      process.exit(1);
    }

    // Auto-commit version bump
    console.log('Auto-committing core version bump...');
    git('add', ...allowed);
    git('commit', '-m', `chore(core): release ${version}`);
  } else {
    console.log('No core version bump detected, proceeding...');
  }

  // Delete old tag locally/remotely (ignore errors)
  try { git('tag', '-d', tag); } catch (_) {}
  try { git('push', 'origin', `:refs/tags/${tag}`); } catch (_) {}

  // Create annotated tag
  git('tag', '-a', tag, '-m', `Release core ${version}`);

  // Push commit (if any) and tag
  git('push', 'origin', 'HEAD');
  git('push', 'origin', tag);

  console.log(`✅ Successfully released and tagged ${tag}`);
} catch (err) {
  console.error('❌ Failed:', err.message);
  process.exit(1);
}
