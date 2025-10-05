<p align="center">
  <a href="https://github.com/Flow-Scanner">
    <img src="https://raw.githubusercontent.com/Flow-Scanner/lightning-flow-scanner-core/main/media/bannerslim.png" style="width: 55%;" />
  </a>
</p>
<p align="center">Scans for unsafe contexts, hardcoded IDs, and other issues to optimize your Flows.</p>

![Demo GIF](media/lfsaction.gif)

_Additional information on the default rules can be found in the [Documentation](https://flow-scanner.github.io/lightning-flow-scanner-core/)._

## Usage

To use this action in your workflow, create a file named `.github/workflows/lightning-flow-scanner.yml` with the following content:

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
        uses: RubenHalman/lightning-flow-scanner-ga@1.2.0
        with:
            severityThreshold: error
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Also ensure the following:

- Create a .secrets file in the root of your repository with the following content:
  - `GITHUB_TOKEN=<your-personal-access-token(PAT)>`
- Workflows have read and write permissions in the repository.
- Allow GitHub Actions to create and approve pull requests.

### Automatically Runs On Pull Requests:

`on:pull_request` will trigger Flow Scanner to scan changed flow files every time a pull request is opened.

### Or Run It Manually:

`on:workflow_dispatch` allows you to run the action on all Flows manually, by following these steps:
    1. Navigate to the "Actions" tab of your GitHub repository.
    2. Click on "Run Flow Scanner" in the list of available workflows.
    3. Press the "Run workflow" button to trigger the action.

---

## Configuration

Flow Scanner can be configured and the action will look for a .flow-scanner file in your repository root, such as:

- `.flow-scanner.yaml`
- `.flow-scanner.yml`
- `.flow-scanner.json`

### Example configuration

```
rules:
  FlowName:
    severity: warning
  HardcodedId:
    severity: error
```

For example:

- With `severityThreshold`: `error`, only `HardcodedId` will fail.
- With `severityThreshold`: `warning`, both `HardcodedId `and `FlowName` will fail the workflow.

If no configurations are found, the scanner falls back to the default rules/threshold.

## Development Setup

To debug the action locally you need to ensure you have `npm` and `act` installed and follow these steps:

1. Run `npm run build` to compile a new version
2. Run act: Use the act command to run the workflow:
   `act workflow_dispatch --secret-file .secrets`

Want to help improve this project? See the [Contributing Guidelines](https://github.com/Flow-Scanner/lightning-flow-scanner-core/main/CONTRIBUTING.md) to get started.
