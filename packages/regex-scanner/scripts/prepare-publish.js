const fs = require('fs');
const path = require('path');

// Read the source package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Create a new package.json for publishing
const publishPkg = {
  ...pkg,
  // Fix paths - in the published package, files are at the root of out/
  main: "index.js",
  types: "index.d.ts",
  exports: {
    ".": {
      import: "./index.js",
      require: "./index.js",
      types: "./index.d.ts"
    }
  },
  // Remove dev-only fields
  scripts: undefined,
  devDependencies: undefined
};

// Ensure out directory exists
if (!fs.existsSync('out')) {
  fs.mkdirSync('out');
}

// Copy package-specific README
if (fs.existsSync('README.md')) {
  fs.copyFileSync('README.md', path.join('out', 'README.md'));
}

// Copy LICENSE from monorepo root
const licenseSource = path.join('..', '..', 'LICENSE.md');
if (fs.existsSync(licenseSource)) {
  fs.copyFileSync(licenseSource, path.join('out', 'LICENSE.md'));
}

// Write the cleaned package.json
fs.writeFileSync(
  path.join('out', 'package.json'),
  JSON.stringify(publishPkg, null, 2) + '\n'
);

console.log('✓ Prepared package in out/');
