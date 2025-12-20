// scripts/publish-core-tag.js
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkgPath = path.join(__dirname, '..', 'packages', 'core', 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.error('ERROR: Cannot find packages/core/package.json');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const tag = `core-v${version}`;

console.log(`Preparing release tag: ${tag}`);

// Use execFileSync for safer cross-platform argument handling
function git(...args) {
  execFileSync('git', args, { stdio: 'inherit' });
}

try {
  // Check for uncommitted changes
  const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();

  if (status) {
    const allowed = ['packages/core/package.json', 'pnpm-lock.yaml'];
    const modified = status
  .split('\n')
  .map(line => line.replace(/^\s*[MADRCU?!]+\s+/, '').trim())
  .filter(Boolean);
    const unexpected = modified.filter(f => !allowed.includes(f));
    if (unexpected.length > 0) {
      console.error('❌ Uncommitted changes not allowed:', unexpected);
      process.exit(1);
    }

    // Auto-commit version bump
    console.log('Auto-committing version bump...');
    git('add', 'packages/core/package.json', 'pnpm-lock.yaml');
    git('commit', '-m', `chore(core): release ${version}`);
  } else {
    console.log('No version bump detected, proceeding...');
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
