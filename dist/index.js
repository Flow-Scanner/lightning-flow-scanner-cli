require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 444:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 898:
/***/ ((module) => {

module.exports = eval("require")("js-yaml");


/***/ }),

/***/ 43:
/***/ ((module) => {

module.exports = eval("require")("lightning-flow-scanner-core");


/***/ }),

/***/ 896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 928:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const core = __nccwpck_require__(396);
const github = __nccwpck_require__(444);
const lfs_core = __nccwpck_require__(43);
const fs = __nccwpck_require__(896);
const path = __nccwpck_require__(928);
const yaml = __nccwpck_require__(898);

const CONFIG_PATHS = [
  ".flow-scanner.yaml",
  ".flow-scanner.yml",
  ".flow-scanner.json",
  "config/.flow-scanner.yaml",
  "config/.flow-scanner.yml",
  ".flow-scanner"
];

const SEVERITY_LEVELS = ["note", "warning", "error"];

async function loadConfig() {
  for (const configPath of CONFIG_PATHS) {
    if (fs.existsSync(configPath)) {
      core.info(`Found config file: ${configPath}`);
      try {
        const raw = fs.readFileSync(configPath, "utf8");
        const ext = path.extname(configPath).toLowerCase();
        if (ext === ".yaml" || ext === ".yml" || configPath === ".flow-scanner") {
          return yaml.load(raw);
        } else if (ext === ".json") {
          return JSON.parse(raw);
        }
      } catch (err) {
        core.warning(`Failed to parse config file ${configPath}: ${err.message}`);
      }
    }
  }
  core.info("No config file found. Using default scanner behavior.");
  return {};
}

function getSeverityThreshold(config) {
  // First check workflow input
  const thresholdInput = core.getInput("severityThreshold");
  if (SEVERITY_LEVELS.includes(thresholdInput)) {
    core.info(`Using severity threshold from workflow input: ${thresholdInput}`);
    return thresholdInput;
  }

  // Else check config file
  if (config?.severityThreshold && SEVERITY_LEVELS.includes(config.severityThreshold)) {
    core.info(`Using severity threshold from config file: ${config.severityThreshold}`);
    return config.severityThreshold;
  }

  // Fallback
  core.info("Using default severity threshold: warning");
  return "warning";
}

function meetsThreshold(severity, threshold) {
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

    // Resolve commit SHA
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

    // Collect flow files
    if (context.eventName === "pull_request") {
      const pull_number = context.payload.pull_request.number;
      const { data: prFiles } = await octokit.rest.pulls.listFiles({
        owner: repo.owner,
        repo: repo.repo,
        pull_number
      });
      files = prFiles
        .map(file => file.filename)
        .filter(file => file.endsWith("flow-meta.xml") || file.endsWith("flow"));
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
            (item.path.endsWith("flow-meta.xml") || item.path.endsWith("flow"))
        )
        .map(item => item.path);
    }

    // Load scanner config
    const config = await loadConfig();
    const severityThreshold = getSeverityThreshold(config);

    // Parse flows
    let pFlows = [];
    for (const file of files) {
      pFlows.push(...(await lfs_core.parse([file])));
    }

    if (pFlows.length > 0) {
      console.log("Scanning " + pFlows.length + " Flows...");
      let scanResults = [];
      for (let flow of pFlows) {
        // Pass IRulesConfig into scanner
        const res = lfs_core.scan([flow], config);
        scanResults.push(...res);
      }

      if (scanResults) {
        const tableRows = [];
        const thresholdViolations = [];

        for (let scanResult of scanResults) {
          if (scanResult.ruleResults.length > 0) {
            for (let ruleResult of scanResult.ruleResults) {
              if (ruleResult.occurs) {
                let details = ruleResult.details;
                if (Array.isArray(details) && details.length > 0) {
                  for (let detail of details) {
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

                    if (meetsThreshold(severity, severityThreshold)) {
                      thresholdViolations.push(row);
                    }
                  }
                }
              }
            }
          }
        }

        core.setOutput("scanResults", tableRows);
        if (tableRows.length > 0) {
          console.table(tableRows, ["flow", "violation", "type", "rule", "severity"]);
        }

        if (thresholdViolations.length > 0) {
          core.setFailed(
            `${thresholdViolations.length} violations at severity >= ${severityThreshold} in ${pFlows.length} Flows.`
          );
        } else {
          core.info(
            `0 violations at severity >= ${severityThreshold} in ${pFlows.length} Flows.`
          );
        }
      }
    } else {
      core.info(`No Flows identified within the repository..`);
    }
  } catch (e) {
    console.error(e);
    core.setFailed(e.message);
  }
}

run();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map