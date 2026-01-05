const fs = require('fs');
const path = require('path');

// Load the compiled RuleRegistry
const { ruleRegistry } = require('../../packages/core/out/main/config/RuleRegistry.js');

// Load README
const readmePath = path.join(__dirname, '../..', 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// 1. Extract metadata from RuleRegistry
function getRuleMetadata(ruleRegistry) {
  const rules = [];
  const allRuleIds = ruleRegistry.getAllRuleIds(true); // Include beta rules
  for (const ruleId of allRuleIds) {
    const entry = ruleRegistry.get(ruleId);
    const instance = ruleRegistry.createInstance(ruleId);
    rules.push({
      ruleId: instance.ruleId,
      className: entry.legacyName,
      title: instance.label,
      description: instance.description,
      severity: instance.severity,
      category: instance.category,
      isBeta: entry.isBeta
    });
  }
  return rules;
}

// 2. Sort rules by category, then severity, then alphabetically
function sortRules(rules) {
  const categoryOrder = { 'problem': 1, 'suggestion': 2, 'layout': 3 };
  const severityOrder = { 'error': 1, 'warning': 2, 'note': 3 };
  return rules.sort((a, b) => {
    const catA = categoryOrder[a.category] || 999;
    const catB = categoryOrder[b.category] || 999;
    if (catA !== catB) return catA - catB;

    const sevA = severityOrder[a.severity?.toLowerCase()] || 999;
    const sevB = severityOrder[b.severity?.toLowerCase()] || 999;
    if (sevA !== sevB) return sevA - sevB;

    return a.title.localeCompare(b.title);
  });
}

// 3. Format severity with emoji
function formatSeverity(severity) {
  const severityMap = {
    'error': '🔴 *Error*',
    'warning': '🟡 *Warning*',
    'note': '🔵 *Note*'
  };
  return severityMap[severity?.toLowerCase()] || '🟡 *Warning*';
}

// 4. Format each rule as markdown (now using ####)
function formatRule(rule) {
  const betaBadge = rule.isBeta
    ? ' ![Beta](https://img.shields.io/badge/status-beta-yellow)'
    : '';
  return `#### ${rule.title}${betaBadge}
${rule.description}

**Rule ID:** \`${rule.ruleId}\`
**Class Name:** _[${rule.className}](packages/core/src/main/rules/${rule.className}.ts)_
**Severity:** ${formatSeverity(rule.severity)}`;
}

// 5. Build rules content with category headers + formal introductions
function buildRulesContent(rules) {
  const categoryInfo = {
    'problem': {
      header: '### Problems',
      intro: 'Rules that detect issues highly likely to cause runtime errors, security risks, governor limit exceptions, or deployment failures.'
    },
    'suggestion': {
      header: '### Suggestions',
      intro: 'Rules in this category recommend better patterns and optimizations related to performance, bulkification, trigger behavior, and overall design. Following them improves efficiency and long-term maintainability without affecting correctness.'
    },
    'layout': {
      header: '### Layout',
      intro: 'Rules in this category enforce consistency in naming, documentation, element organization, and visual layout. They help ensure Flows remain readable, well-documented, and structured as automations scale.'
    }
  };

  let content = '';
  let currentCategory = null;

  for (const rule of rules) {
    if (rule.category !== currentCategory) {
      // Add spacing before new category (except the very first one)
      if (content) content += '\n';

      const info = categoryInfo[rule.category] || { header: '### Other', intro: '' };
      content += info.header + '\n\n';
      content += info.intro + '\n\n';

      currentCategory = rule.category;
    }

    content += formatRule(rule) + '\n\n';
  }

  return content.trimEnd();
}

// 6. Replace content between markers
function updateReadmeWithRules(readmeContent, rulesContent) {
  const startMarker = '<!-- START GENERATED_RULES -->';
  const endMarker = '<!-- END GENERATED_RULES -->';
  const startIndex = readmeContent.indexOf(startMarker);
  const endIndex = readmeContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Could not find generated rules markers in README.md');
  }

  const before = readmeContent.substring(0, startIndex + startMarker.length);
  const after = readmeContent.substring(endIndex);

  return before + '\n\n' + rulesContent + '\n' + after;
}

// Main execution
try {
  console.log('📖 Generating README from rule source code...\n');

  console.log('1️⃣  Extracting rule metadata from RuleRegistry...');
  const rules = getRuleMetadata(ruleRegistry);
  console.log(`   ✅ Found ${rules.length} rules (${rules.filter(r => r.isBeta).length} beta)\n`);

  console.log('2️⃣  Sorting rules by category, severity, and alphabetically...');
  const sortedRules = sortRules(rules);
  console.log(`   ✅ Rules sorted\n`);

  console.log('3️⃣  Building rules content with category introductions...');
  const rulesContent = buildRulesContent(sortedRules);
  console.log(`   ✅ Rules content built\n`);

  console.log('4️⃣  Updating README.md...');
  const updatedReadme = updateReadmeWithRules(readmeContent, rulesContent);
  console.log(`   ✅ README updated\n`);

  console.log('5️⃣  Writing to README.md...');
  fs.writeFileSync(readmePath, updatedReadme, 'utf8');
  console.log(`   ✅ Written to ${readmePath}\n`);

  console.log('✨ README generation complete!\n');
  console.log('Rules included:');
  sortedRules.forEach(rule => {
    const betaLabel = rule.isBeta ? ' [BETA]' : '';
    console.log(`   - ${rule.title}${betaLabel}`);
  });
} catch (error) {
  console.error('❌ Error generating README:', error.message);
  console.error(error.stack);
  process.exit(1);
}