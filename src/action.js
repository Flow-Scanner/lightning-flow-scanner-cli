const core = require("@actions/core");
const github = require("@actions/github");
const lfs_core = require("lightning-flow-scanner-core");

async function run() {
  const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
  const octokit = github.getOctokit(GITHUB_TOKEN);

  const { context } = github;
  const repo = context.repo;

  try {
    let files = [];

    // Determine the value of head_sha based on the event type
    let head_sha;
    if (context.eventName === 'pull_request') {
      head_sha = context.payload.pull_request.head.sha;
    } else {
      // Fetch the latest commit SHA of the default branch
      const { data: defaultBranch } = await octokit.rest.repos.getBranch({
        owner: repo.owner,
        repo: repo.repo,
        branch: 'master', 
      });
      head_sha = defaultBranch.commit.sha;
    }

    // Find Flows Based on Event Type
    if (context.eventName === 'pull_request') {
      const pull_number = context.payload.pull_request.number;
      const { data: prFiles } = await octokit.rest.pulls.listFiles({
        owner: repo.owner,
        repo: repo.repo,
        pull_number: pull_number,
      });
      files = prFiles
        .map(file => file.filename)
        .filter(file => file.endsWith('flow-meta.xml') || file.endsWith('flow'));
    } else {
      const { data: latestCommit } = await octokit.rest.repos.listCommits({
        owner: repo.owner,
        repo: repo.repo,
        per_page: 1,
      });
      const latestCommitSha = latestCommit[0].sha;
      
      const { data: tree } = await octokit.rest.git.getTree({
        owner: repo.owner,
        repo: repo.repo,
        tree_sha: latestCommitSha,
        recursive: true,
      });
      
      files = tree.tree
        .filter(item => item.type === 'blob' && (item.path.endsWith('flow-meta.xml') || item.path.endsWith('flow')))
        .map(item => item.path);
    }

    let pFlows = [];
    // Parse Flows
    for (const file of files) {
      pFlows.push(...(await lfs_core.parse([file])));
    }

    if (pFlows.length > 0) {
      console.log("Scanning " + pFlows.length + " Flows...");
      let scanResults = [];
      for (let flow of pFlows) {
        const res = lfs_core.scan([flow]);
        scanResults.push(...res);
      }

      // Scan the flows
      if (scanResults) {
        // Output scan results in a table
        const tableRows = [];
        for (let scanResult of scanResults) {
          if (scanResult.ruleResults.length > 0) {
            for (let ruleResult of scanResult.ruleResults) {
              if (ruleResult.errorMessage) {
                console.log("error occurred = ", ruleResult.errorMessage);
              }
              if (ruleResult.occurs) {
                let details = ruleResult.details;
                if (Array.isArray(details) && details.length > 0) {
                  for (let detail of details) {
                    const row = {
                      flow: scanResult.flow.name,
                      violation: detail.name || '',
                      rule: ruleResult.ruleName,
                      type: detail.type || ''
                    };
                    // Push the row object to the tableRows array
                    tableRows.push(row);
                  } 
                } else {
                  console.log('inconsistent result!');
                }
              }
            }
          }
        }

        core.setOutput(tableRows);
        if (tableRows.length > 0) {
          // Log the table rows using console.table()
          console.table(tableRows, ['flow', 'violation', 'type', 'rule']);
          core.setFailed(`${tableRows.length} violations identied in ${pFlows.length} Flows.`)
        } else {
          core.info(`0 violations identied in ${pFlows.length} Flows.`)
        }
      }
    } else {
      core.info(`No Flows identified within the repository..`)
    }
  } catch (e) {
    console.error(e);
  }
}

run();
