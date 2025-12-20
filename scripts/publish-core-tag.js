// scripts/publish-core-tag.js 
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// This is the ONLY path that works in your fresh clone
const pkgPath = path.join(__dirname, '..', 'packages', 'core', 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.error('ERROR: Cannot find packages/core/package.json');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const tagName = `core-v${version}`;

console.log(`Preparing release tag: ${tagName}`);

function git(...args) {
  return execSync(`git ${args.join(' ')}`, { stdio: 'inherit' });
}

try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();

  if (status) {
    const allowedPaths = [
      'packages/core/package.json',
      'pnpm-lock.yaml'
    ];

    const modifiedFiles = status
      .split('\n')
      .map(line => line.slice(3).trim()) // extract filename
      .filter(Boolean);

    const unexpected = modifiedFiles.filter(f => !allowedPaths.includes(f));

    if (unexpected.length > 0) {
      console.error('❌ Found uncommitted changes that are NOT part of the version bump:');
      unexpected.forEach(f => console.error(`   ${f}`));
      console.error('\nPlease commit or stash your code changes before publishing.');
      console.error('Only package.json and pnpm-lock.yaml are allowed to be auto-committed.');
      process.exit(1);
    }

    // Safe: only version bump files are uncommitted → auto-commit them
    console.log('Version bump detected (package.json / lockfile). Auto-committing...');
    git('add', 'packages/core/package.json', 'pnpm-lock.yaml');
    git('commit', '-m', `chore(core): release ${version}`);
  } else {
    console.log('Version bump already committed or no changes needed.');
  }

  // Clean up old tag locally and remotely
  try { git('tag', '-d', tagName); } catch (_) {}
  try { git('push', 'origin', `:refs/tags/${tagName}`); } catch (_) {}

  // Create new annotated tag
  git('tag', '-a', tagName, '-m', `Release core ${version}`);

  // Push commit (if we just made one) and the tag
  git('push', 'origin', 'HEAD');
  git('push', 'origin', tagName);

  console.log(`✅ Successfully released and tagged ${tagName}`);
} catch (err) {
  console.error('❌ Failed:', err.message);
  process.exit(1);
}