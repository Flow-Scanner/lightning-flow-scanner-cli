const core = require("@actions/core");
const github = require("@actions/github");
const lfs_core = require("@flow-scanner/lightning-flow-scanner-core");
const fs = require("fs");
const path = require("path");
const { cosmiconfig } = require("cosmiconfig");
const { exportSarif } = lfs_core;

const SEVERITY_LEVELS = ["note", "warning", "error"];
const OUTPUT_MODES = ["sarif", "table"];

async function loadScannerOptions() {
  const moduleName = "flow-scanner";
  const searchPlaces = [
    "package.json",
    `.${moduleName}.yaml`,
    `.${moduleName}.yml`,
    `.${moduleName}.json`,
    `config/.${moduleName}.yaml`,
    `config/.${moduleName}.yml`,
    ".flow-scanner"
  ];
  const explorer = cosmiconfig(moduleName, { searchPlaces });
  const result = await explorer.search();
  if (result && !result.isEmpty) {
    core.info(`Found config file: ${result.filepath}`);
    return result.config;
  }
  core.info("No config file found. Using default scanner behavior.");
  return {};
}

function getThreshold(config) {
  const thresholdInput = core.getInput("threshold");
  if (thresholdInput && SEVERITY_LEVELS.includes(thresholdInput)) {
    core.info(`Using threshold from workflow input: ${thresholdInput}`);
    return thresholdInput;
  }
  if (config?.threshold && SEVERITY_LEVELS.includes(config.threshold)) {
    core.info(`Using threshold from config file: ${config.threshold}`);
    return config.threshold;
  }
  core.info("No threshold specified. Will only be used in 'table' mode.");
  return null; // No default
}

function getOutputMode() {
  const modeInput = core.getInput("outputMode") || "sarif";
  if (OUTPUT_MODES.includes(modeInput)) {
    core.info(`Using output mode: ${modeInput}`);
    return modeInput;
  }
  core.info(`Invalid outputMode '${modeInput}'. Using default: sarif`);
  return "sarif";
}

function meetsThreshold(severity, threshold) {
  if (!threshold) return false;
  const sevIndex = SEVERITY_LEVELS.indexOf(severity);
  const thIndex = SEVERITY_LEVELS.indexOf(threshold);
  return sevIndex >= thIndex;
}

async function run() {
  const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
  const octokit = github.getOctokit(GITHUB_TOKEN);
  const { context } = github;
  const repo = context.repo;

  try {
    let files = [];
    let head_sha;

    // Determine commit SHA
    if (context.eventName === "pull_request") {
      head_sha = context.payload.pull_request.head.sha;
    } else {
      const { data: defaultBranch } = await octokit.rest.repos.getBranch({
        owner: repo.owner,
        repo: repo.repo,
        branch: "master"
      });
      head_sha = defaultBranch.commit.sha;
    }

    // Get list of flow files
    if (context.eventName === "pull_request") {
      const pull_number = context.payload.pull_request.number;
      const { data: prFiles } = await octokit.rest.pulls.listFiles({
        owner: repo.owner,
        repo: repo.repo,
        pull_number
      });
      files = prFiles
        .map(file => file.filename)
        .filter(file => file.endsWith("flow-meta.xml") || file.endsWith(".flow"));
    } else {
      const { data: latestCommit } = await octokit.rest.repos.listCommits({
        owner: repo.owner,
        repo: repo.repo,
        per_page: 1
      });
      const latestCommitSha = latestCommit[0].sha;
      const { data: tree } = await octokit.rest.git.getTree({
        owner: repo.owner,
        repo: repo.repo,
        tree_sha: latestCommitSha,
        recursive: true
      });
      files = tree.tree
        .filter(
          item =>
            item.type === "blob" &&
            (item.path.endsWith("flow-meta.xml") || item.path.endsWith(".flow"))
        )
        .map(item => item.path);
    }

    const config = await loadScannerOptions();
    const threshold = getThreshold(config);
    const outputMode = getOutputMode();

    let pFlows = [];
    for (const file of files) {
      pFlows.push(...(await lfs_core.parse([file])));
    }

    if (pFlows.length === 0) {
      core.info("No Flows identified in the repository.");
      return;
    }

    console.log(`Scanning ${pFlows.length} Flow(s)...`);
    let scanResults = [];
    for (const flow of pFlows) {
      const res = lfs_core.scan([flow], config);
      scanResults.push(...res);
    }

    if (scanResults.length === 0) {
      core.info("No issues found in scanned flows.");
      return;
    }

    const tableRows = [];
    const violations = [];

    for (const scanResult of scanResults) {
      if (scanResult.ruleResults.length > 0) {
        for (const ruleResult of scanResult.ruleResults) {
          if (ruleResult.occurs && Array.isArray(ruleResult.details)) {
            for (const detail of ruleResult.details) {
              const severity =
                config.rules?.[ruleResult.ruleName]?.severity ||
                ruleResult.severity ||
                "warning";

              const row = {
                flow: scanResult.flow.name,
                violation: detail.name || "",
                rule: ruleResult.ruleName,
                type: detail.type || "",
                severity
              };
              tableRows.push(row);

              // Always collect for SARIF
              violations.push(row);
            }
          }
        }
      }
    }

    // SARIF Mode: Fail on ANY result
    if (outputMode === "sarif") {
      const sarifPath = path.join(process.env.GITHUB_WORKSPACE || '', 'flow-scanner-results.sarif');

      // Always force single run — ignore core's behavior
      const baseSarif = exportSarif(scanResults);
      const parsed = JSON.parse(baseSarif);

      if (parsed.runs && parsed.runs.length > 1) {
        core.info(`Merging ${parsed.runs.length} SARIF runs into 1`);

        const mergedRun = {
          tool: parsed.runs[0].tool || { driver: { name: "FlowScanner" } },
          results: []
        };

        // Collect all results from all runs
        for (const run of parsed.runs) {
          if (run.results) {
            mergedRun.results.push(...run.results);
          }
          // Preserve artifacts from first run only
          if (!mergedRun.artifacts && run.artifacts) {
            mergedRun.artifacts = run.artifacts;
          }
        }

        parsed.runs = [mergedRun];
      }

      const sarifOutput = JSON.stringify(parsed, null, 2);
      fs.writeFileSync(sarifPath, sarifOutput);
      core.setOutput('sarifPath', sarifPath);
      core.info(`SARIF report generated: ${sarifPath} (1 run)`);

      if (violations.length > 0) {
        core.setFailed(`${violations.length} flow issue(s) found. SARIF mode fails on any result.`);
      } else {
        core.info("SARIF report generated with no issues.");
      }
      return;
    }
    // Table Mode: Respect threshold
    if (outputMode === "table") {
      core.setOutput("scanResults", tableRows);
      if (tableRows.length > 0) {
        console.table(tableRows, ["flow", "violation", "type", "rule", "severity"]);
      }

      const thresholdViolations = threshold
        ? tableRows.filter(r => meetsThreshold(r.severity, threshold))
        : [];

      core.info(`Threshold: ${threshold || "none (not applied in table mode if unset)"}`);
      core.info(`Violations >= threshold: ${thresholdViolations.length}`);

      if (threshold && thresholdViolations.length > 0) {
        core.setFailed(
          `${thresholdViolations.length} violation(s) at severity >= ${threshold}.`
        );
      } else if (!threshold) {
        core.info("No threshold set — action passes regardless of findings.");
      } else {
        core.info("All findings below threshold. Action passes.");
      }
    }

  } catch (e) {
    console.error(e);
    core.setFailed(e.message);
  }
}

run();