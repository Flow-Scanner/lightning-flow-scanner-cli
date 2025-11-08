<p align="center">
  <a href="https://github.com/Flow-Scanner">
    <img src="media/bannerslim.png" style="width: 41%;" />
  </a>
</p>
<p align="center"><em>Detect unsafe contexts, queries in loops, hardcoded IDs, and more to optimize Salesforce Flows.</em></p>

<p align="center">
 <img src="media/lfsaction.gif" alt="Lightning Flow Scanner Demo" width="70%" />
</p>

[![GitHub Marketplace](https://img.shields.io/badge/GitHub%20Action-Lightning%20Flow%20Scanner-blue?logo=github)](https://github.com/marketplace/actions/run-flow-scanner)

- **[Usage](#usage)**
  - [Run On Pull Requests](#run-on-pull-requests)
  - [Run As Manual Action](run-as-manual-action)
- **[Configuration](#configuration)**
  - [Scanner Options](scanner-options)
- **[Development](#development)**

## Usage

To enable the Lightning Flow Scanner in your workflow, create a file named `.github/workflows/lightning-flow-scanner.yml` with the following content:

```yaml
name: lightning-flow-scanner
on:
  workflow_dispatch:
  pull_request:
jobs:
  action:
    runs-on: ubuntu-latest
    steps:
      - name: Get Latest Version
        uses: actions/checkout@v4
      - name: Run Flow Scanner
        uses: Flow-Scanner/lightning-flow-scanner-action@v1.4.3
        with:
            # 
            severityThreshold: error
            # Your Token
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
Also ensure the following:

- Create a .secrets file in the root of your repository with the following content:
  - `GITHUB_TOKEN=<your-personal-access-token(PAT)>`
- Workflows have read and write permissions in the repository.
- Allow GitHub Actions to create and approve pull requests.

**Privacy:** Zero user data collected. All processing is client-side.
→ See Data Handling in our [Security Policy](https://github.com/Flow-Scanner/lightning-flow-scanner-action?tab=security-ov-file).

### Run On Pull Requests

`on:pull_request` will trigger Flow Scanner to scan changed flow files every time a pull request is opened.

### Run As Manual Action

`on:workflow_dispatch` allows you to run the action on all Flows manually, by following these steps:
    1. Navigate to the "Actions" tab of your GitHub repository.
    2. Click on "Run Flow Scanner" in the list of available workflows.
    3. Press the "Run workflow" button to trigger the action.

## Configuration

It is recommended to set up a `.flow-scanner.yml` and define:

- The rules to be executed.
- The severity of violating any specific rule.
- Rule properties such as REGEX expressions.
- Any known exceptions that should be ignored during scanning.

### Scanner Options

```json
{
  "rules": {
    // Your rules here
  },
  "exceptions": {
    // Your exceptions here
  },
  "betamode": false // Enable beta rules
}
```

Using the rules section of your configurations, you can specify the list of rules to be run. Furthermore, you can define the severity and configure expressions of rules.  Below is a breakdown of the available attributes of rule configuration:

```json
{
  "rules": {
    "<RuleName>": {
      "severity": "<Severity>",
      "expression": "<Expression>"
    }
  }
}
```

Note: if you prefer JSON format, you can create a `.flow-scanner.json` file using the same format. For a more on configurations, review the [scanner documentation](https://flow-scanner.github.io/lightning-flow-scanner-core/#configuration).

## Development

To debug the action locally, you need to have [`ncc`](https://www.npmjs.com/package/@vercel/ncc) and [`act`](https://nektosact.com/installation/index.html) installed. 

```bash
npm i -g @vercel/ncc
```

```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash 
```

1. Compile a new version
```bash
npm run build
```

2. Test the workflows locally:

```bash
act workflow_dispatch --secret-file .secrets
```

**Want to help improve [Lightning Flow Scanner](https://github.com/Flow-Scanner)? See our [Contributing Guidelines](https://github.com/Flow-Scanner/lightning-flow-scanner-core/blob/main/CONTRIBUTING.md).**
