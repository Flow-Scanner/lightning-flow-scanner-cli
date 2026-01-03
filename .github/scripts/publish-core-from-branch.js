// .github/scripts/publish-core-from-branch.js
// Helper script to publish core from a feature branch
const { execFileSync, execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

const repoRoot = path.resolve(__dirname, '../..');

// Git wrapper
function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', cwd: repoRoot }).trim();
}

function gitInherit(...args) {
  execFileSync('git', args, { stdio: 'inherit', cwd: repoRoot });
}

function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  try {
    // Get current branch
    const currentBranch = git('branch', '--show-current');
    console.log(`📍 Current branch: ${currentBranch}`);

    // If already on main, just run publish script directly
    if (currentBranch === 'main') {
      console.log('✅ Already on main, running publish script...');
      require('./publish-core-tag.js');
      return;
    }

    // Check for uncommitted changes in core
    const coreStatus = git('status', '--porcelain', 'packages/core');
    if (coreStatus) {
      console.error('❌ You have uncommitted changes in packages/core.');
      console.error('Please commit them first before publishing.');
      process.exit(1);
    }

    // Confirm merge
    console.log('\n⚠️  This will:');
    console.log(`  1. Switch to main branch`);
    console.log(`  2. Merge ${currentBranch} into main (all committed changes)`);
    console.log(`  3. Publish core and create tag`);
    console.log(`  4. Push to origin`);
    console.log(`  5. Return to ${currentBranch}\n`);

    const proceed = await confirm('Do you want to continue?');
    if (!proceed) {
      console.log('❌ Aborted.');
      process.exit(0);
    }

    // Switch to main
    console.log('\n📌 Switching to main...');
    gitInherit('checkout', 'main');

    // Pull latest
    console.log('⬇️  Pulling latest main...');
    try {
      gitInherit('pull', 'origin', 'main');
    } catch (err) {
      console.log('⚠️  Pull failed, continuing anyway...');
    }

    // Merge feature branch
    console.log(`\n🔀 Merging ${currentBranch} into main...`);
    try {
      gitInherit('merge', currentBranch, '--no-edit');
    } catch (err) {
      console.error('❌ Merge failed. Resolve conflicts manually and run publish-core-tag.js');
      process.exit(1);
    }

    // Run publish script
    console.log('\n📦 Publishing core...');
    require('./publish-core-tag.js');

    // Return to original branch
    console.log(`\n↩️  Returning to ${currentBranch}...`);
    gitInherit('checkout', currentBranch);

    console.log(`\n✅ Done! Core published from main, you're back on ${currentBranch}`);
    console.log('💡 Note: Your feature branch changes are now also on main.');
    console.log('   Continue working on your branch - when ready, merge/rebase as normal.');

  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

main();
