/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import { SelectFlows } from '../libs/SelectFlows';
import { SaveFlow } from '../libs/SaveFlow';
import { ScanOverview } from '../panels/ScanOverviewPanel';
import * as core from '@flow-scanner/lightning-flow-scanner-core';
import { CacheProvider } from '../providers/cache-provider';
import { OutputChannel } from '../providers/outputChannel';
import { loadScannerConfig } from '../providers/config-provider';
import * as path from 'path';

const toFsPaths = (uris: vscode.Uri[]): string[] => uris.map(u => u.fsPath);
const toUris = (paths: string[]): vscode.Uri[] => paths.map(p => vscode.Uri.file(p));

type Severity = "error" | "warning" | "note";

interface RuleEntry {
  severity: Severity;
  expression?: string;
  enabled?: boolean;
}

function normalizeSeverity(s: unknown): Severity {
  if (s === "error" || s === "warning" || s === "note") return s;
  return "warning"; // default
}

type RuleConfig = Record<string, RuleEntry>;

export default class Commands {
  constructor(private context: vscode.ExtensionContext) { }

  get handlers() {
    const rawHandlers: Record<string, (...args: any[]) => any> = {
      'flowscanner.openDocumentation': () => this.openDocumentation(),
      'flowscanner.configRules': () => this.configRules(),
      'flowscanner.scanFlows': (options?: any) => this.scanFlows(options),
      'flowscanner.generateFlowDocs': (options?: any) => this.generateFlowDocs(options),
      'flowscanner.fixFlows': () => this.fixFlows(),
    };
    return Object.entries(rawHandlers).map(([command, handler]) => {
      return [command, async (...args: any[]) => handler(...args)] as const;
    });
  }

  private openDocumentation() {
    const url = vscode.Uri.parse('https://github.com/Flow-Scanner/lightning-flow-scanner?tab=readme-ov-file#default-rules');
    vscode.env.openExternal(url);
  }

  private async loadConfig(workspacePath: string): Promise<{ rules: RuleConfig; betamode: boolean; ruleMode: "merged" | "isolated"; ignore?: string[] }> {
    const rawConfig = await loadScannerConfig(workspacePath);
    // OutputChannel.getInstance().logChannel.debug('Raw config loaded:', JSON.stringify(rawConfig, null, 2));
    const rawRules = (rawConfig.rules as Record<string, unknown>) || {};
    const rules: RuleConfig = {};
    for (const [name, rule] of Object.entries(rawRules)) {
      if (typeof rule === 'object' && rule !== null) {
        const r = rule as Record<string, unknown>;
        rules[name] = {
          severity: normalizeSeverity(r.severity),
          expression: r.expression !== undefined ? String(r.expression) : undefined,
          enabled: r.enabled !== undefined ? !!r.enabled : undefined
        };
      }
    }
    const betamode = !!rawConfig.betamode;
    const ruleMode: "merged" | "isolated" = String(rawConfig.ruleMode ?? 'merged').toLowerCase() === 'isolated' ? 'isolated' : 'merged';
    const ignore = Array.isArray(rawConfig.ignore) ? rawConfig.ignore as string[] : undefined;
    await CacheProvider.instance.set('ruleconfig', { rules, betamode, ruleMode });
    return { rules, betamode, ruleMode, ignore };
  }

  private async saveConfig(workspacePath: string, rules: RuleConfig, betamode: boolean, ruleMode: "merged" | "isolated") {
    const configPath = path.join(workspacePath, '.flow-scanner.yml');
    const yamlLines: string[] = [];
    if (ruleMode !== 'merged') {
      yamlLines.push(`ruleMode: ${ruleMode}`);
    }
    if (betamode) {
      yamlLines.push('betamode: true');
    }
    if (Object.keys(rules).length > 0) {
      yamlLines.push('rules:');
      for (const [name, entry] of Object.entries(rules)) {
        yamlLines.push(`  ${name}:`); // 2 spaces
        if (entry.enabled !== undefined) {
          yamlLines.push(`    enabled: ${entry.enabled}`); // 4 spaces
        }
        yamlLines.push(`    severity: ${entry.severity}`); // 4 spaces
        if (entry.expression) {
          yamlLines.push(`    expression: ${JSON.stringify(entry.expression)}`); // 4 spaces
        }
      }
    }
    const yamlString = yamlLines.join('\n');
    await vscode.workspace.fs.writeFile(vscode.Uri.file(configPath), new TextEncoder().encode(yamlString));
    await CacheProvider.instance.set('ruleconfig', { rules, betamode, ruleMode });
  }

  private async configRules(): Promise<boolean> {
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (!ws) {
      vscode.window.showErrorMessage('No workspace folder found.');
      return false;
    }
    const workspacePath = ws.uri.fsPath;
    const configPath = path.join(workspacePath, '.flow-scanner.yml');

    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(configPath));
      const choice = await vscode.window.showQuickPick(
        ['Open Config File', 'Reconfigure Rules'],
        { placeHolder: 'Configuration file exists. What would you like to do?' }
      );
      if (choice === undefined) return false;
      if (choice === 'Open Config File') {
        const doc = await vscode.workspace.openTextDocument(configPath);
        await vscode.window.showTextDocument(doc);
        return false;
      }
    } catch {
      // file doesn't exist, continue
    }

    const config = await this.loadConfig(workspacePath);
    let rules = config.rules;
    let currentBetamode = config.betamode;
    let currentRuleMode = config.ruleMode;

    const modeOptions = currentRuleMode === 'merged'
      ? ['Merged (run all, override selected)', 'Isolated (run only selected)']
      : ['Isolated (run only selected)', 'Merged (run all, override selected)'];

    const modeChoice = await vscode.window.showQuickPick(modeOptions, { placeHolder: 'Select rule mode' });
    if (modeChoice === undefined) return false;

    const ruleMode: "merged" | "isolated" = modeChoice.startsWith('Merged') ? 'merged' : 'isolated';
    const betaOptions = currentBetamode ? ['Yes', 'No'] : ['No', 'Yes'];
    const includeBeta = await vscode.window.showQuickPick(betaOptions, { placeHolder: 'Do you want to opt-in for beta rules?' });
    if (includeBeta === undefined) return false;
    const betamode = includeBeta === 'Yes';

    const allRules = core.getRules(undefined, { betaMode: betamode });
    const currentNames = Object.keys(rules);
    const isEmptyConfig = currentNames.length === 0;

    const items = allRules.map(rule => ({
      label: rule.label,
      description: rule.name,
      picked: isEmptyConfig ? true : (rules[rule.name]?.enabled ?? true),
    }));

    const selected = await vscode.window.showQuickPick(items, { canPickMany: true, placeHolder: 'Select rules to enable/disable' });
    if (selected === undefined) return false;

    const selectedNames = new Set(selected.map(s => s.description!));
    const newRules: RuleConfig = {};

    if (ruleMode === 'isolated') {
      for (const item of selected) {
        const def = allRules.find(r => r.name === item.description)!;
        const severity = normalizeSeverity(rules[def.name]?.severity ?? def.severity ?? 'warning');
        const expression = rules[def.name]?.expression;
        newRules[def.name] = { severity };
        if (expression !== undefined) newRules[def.name].expression = expression;
      }
    } else {
      for (const def of allRules) {
        const name = def.name;
        const isSelected = selectedNames.has(name);
        const ruleConfig = rules[name];
        const severity = normalizeSeverity(ruleConfig?.severity ?? def.severity ?? 'warning');
        const expression = ruleConfig?.expression;
        const enabled = isSelected;
        const hasCustomSeverity = severity !== normalizeSeverity(def.severity ?? 'warning');
        const hasCustomExpression = expression !== undefined;
        const hasCustomEnabled = !enabled;

        if (hasCustomSeverity || hasCustomExpression || hasCustomEnabled) {
          newRules[name] = { severity };
          if (expression !== undefined) newRules[name].expression = expression;
          if (hasCustomEnabled) newRules[name].enabled = enabled;
        }
      }
    }

    let changed = false;

    if (selectedNames.has('FlowName')) {
      const def = allRules.find(r => r.name === 'FlowName')!;
      const current = newRules.FlowName?.expression || '';
      const expr = await vscode.window.showInputBox({
        prompt: 'Define naming convention (REGEX) for FlowName',
        placeHolder: '[A-Za-z0-9]+_[A-Za-z0-9]+',
        value: current || '[A-Za-z0-9]+_[A-Za-z0-9]+',
      });
      if (expr !== undefined && expr.trim() !== current) {
        if (!newRules.FlowName) newRules.FlowName = { severity: normalizeSeverity(def.severity ?? 'warning') };
        newRules.FlowName.expression = expr.trim() || undefined;
        changed = true;
      }
    }

    if (selectedNames.has('APIVersion')) {
      const def = allRules.find(r => r.name === 'APIVersion')!;
      const current = newRules.APIVersion?.expression || '';
      const expr = await vscode.window.showInputBox({
        prompt: 'Set API version rule (e.g. ">=50")',
        placeHolder: '>=50',
        value: current || '>=50',
      });
      if (expr !== undefined && expr.trim() !== current) {
        if (!newRules.APIVersion) newRules.APIVersion = { severity: normalizeSeverity(def.severity ?? 'warning') };
        newRules.APIVersion.expression = expr.trim() || undefined;
        changed = true;
      }
    }

    if (changed || Object.keys(newRules).length !== currentNames.length || betamode !== currentBetamode || ruleMode !== currentRuleMode) {
      await this.saveConfig(workspacePath, newRules, betamode, ruleMode);
      vscode.window.showInformationMessage('Configuration saved successfully!');
      return true;
    }

    return false;
  }

  private async scanFlows(options?: {
    ruleMode?: 'merged' | 'isolated';
    betaMode?: boolean;
    overrideConfig?: boolean;
  }) {
    const root = vscode.workspace.workspaceFolders![0].uri;

    const configReset = vscode.workspace.getConfiguration('flowscanner').get('Reset');
    if (configReset) await this.configRules();

    // Load config dynamically from YAML file BEFORE selecting flows
    let config = await this.loadConfig(root.fsPath);

    const selectedUris = await this.selectFlows('Select flow files or folder to scan:', config.ignore);
    if (!selectedUris) return;

    // Apply sidebar overwrites if enabled
    if (options?.overrideConfig) {
      OutputChannel.getInstance().logChannel.debug('Applying sidebar scan options:', options);

      if (options.ruleMode !== undefined) {
        config.ruleMode = options.ruleMode;
      }

      if (options.betaMode !== undefined) {
        config.betamode = options.betaMode;
      }
    }

    if (Object.keys(config.rules).length === 0) {
      const choice = await vscode.window.showWarningMessage(
        'No rules configured. Run "Configure Rules" first?',
        'Configure Now',
        'Scan Anyway'
      );

      if (choice === 'Configure Now') {
        const configured = await this.configRules();

        if (!configured) {
          return;
        }

        // RELOAD config after configuration
        config = await this.loadConfig(root.fsPath);

        // Re-apply sidebar overwrites after reload
        if (options?.overrideConfig) {
          if (options.ruleMode !== undefined) {
            config.ruleMode = options.ruleMode;
          }
          if (options.betaMode !== undefined) {
            config.betamode = options.betaMode;
          }
        }

        if (Object.keys(config.rules).length === 0) {
          vscode.window.showWarningMessage('No rules configured. Scan cancelled.');
          return;
        }
      } else if (!choice) {
        return;
      }
    }

    // Show panel with loading state
    ScanOverview.createOrShow(this.context.extensionUri, []);

    OutputChannel.getInstance().logChannel.debug('Using rule config for scan:', config);
    const scanConfig = { rules: config.rules, betamode: config.betamode, ruleMode: config.ruleMode };
    const parsed = await core.parse(toFsPaths(selectedUris));
    const results = core.scan(parsed, scanConfig);
    await CacheProvider.instance.set('results', results);
    ScanOverview.createOrShow(this.context.extensionUri, results);
  }

  private async generateFlowDocs(options?: {
    mode?: 'combined' | 'separate';
    includeDetails?: boolean;
    collapsedDetails?: boolean;
    outputDir?: string;
    configuredViaSidebar?: boolean;
  }) {
    const root = vscode.workspace.workspaceFolders![0].uri;
    const config = await this.loadConfig(root.fsPath);
    const selectedUris = await this.selectFlows('Select flow files or folder to document:', config.ignore);
    if (!selectedUris) return;

    // Use provided options or prompt for them
    let mode = options?.mode;
    let includeDetails = options?.includeDetails;
    let collapsedDetails = options?.collapsedDetails;

    // If not provided, prompt user
    const interactive = !options?.configuredViaSidebar;

    // Prompt ONLY if interactive
    if (!mode && interactive) {
      const modeChoice = await vscode.window.showQuickPick(
        [
          { label: '📄 Single Combined Document', value: 'combined' as const },
          { label: '📚 Separate Document Per Flow', value: 'separate' as const }
        ],
        { placeHolder: 'How would you like to generate documentation?' }
      );
      if (!modeChoice) return;
      mode = modeChoice.value;
    }

    // Apply defaults if non-interactive
    mode ??= 'combined';

    if (includeDetails === undefined && interactive) {
      const detailsChoice = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Include detailed node information?'
      });
      if (detailsChoice === undefined) return;
      includeDetails = detailsChoice === 'Yes';
    }
    includeDetails ??= true;

    if (collapsedDetails === undefined && includeDetails && interactive) {
      const collapsedChoice = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Collapse details by default?'
      });
      if (collapsedChoice === undefined) return;
      collapsedDetails = collapsedChoice === 'Yes';
    }
    collapsedDetails ??= true;

    // Rest of the implementation stays the same
    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Generating flow documentation...",
        cancellable: false
      }, async (progress) => {
        progress.report({ increment: 0, message: "Parsing flows..." });

        const parsed = await core.parse(toFsPaths(selectedUris));
        const validFlows = parsed.filter(p => p.flow);

        if (validFlows.length === 0) {
          vscode.window.showErrorMessage('No valid flows found to document.');
          return;
        }

        progress.report({ increment: 50, message: `Generating documentation for ${validFlows.length} flow(s)...` });

        const docOptions = {
          includeDetails: includeDetails ?? true,
          includeMarkdownDocs: true,
          collapsedDetails: collapsedDetails ?? true,
        };

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
          vscode.window.showErrorMessage('No workspace folder found.');
          return;
        }

        // ✅ Default to /docs/flow-docs
        const defaultDir = path.join(
          workspaceFolder.uri.fsPath,
          'docs',
          'flow-docs'
        );

        const outputDir = options?.outputDir || defaultDir;

        // ✅ Creates /docs and /docs/flow-docs if missing
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(outputDir));

        if (mode === 'combined') {
          const markdown = core.exportDiagram(parsed, docOptions);
          const fileName = `Flow_Documentation_${Date.now()}.md`;
          const outputFile = vscode.Uri.file(path.join(outputDir, fileName));

          await vscode.workspace.fs.writeFile(outputFile, new TextEncoder().encode(markdown));
          progress.report({ increment: 100 });

          const doc = await vscode.workspace.openTextDocument(outputFile);
          await vscode.window.showTextDocument(doc, { preview: false });
          await vscode.commands.executeCommand('markdown.showPreview', outputFile);

          vscode.window.showInformationMessage(
            `✅ Documentation generated for ${validFlows.length} flow(s)`,
            'Open File'
          ).then(choice => {
            if (choice === 'Open File') {
              vscode.commands.executeCommand('revealFileInOS', outputFile);
            }
          });
        } else {
          const generatedFiles: vscode.Uri[] = [];

          for (let i = 0; i < validFlows.length; i++) {
            const pf = validFlows[i];
            const singleParsed = [pf];
            const markdown = core.exportDiagram(singleParsed, docOptions);

            const safeName = pf.flow!.name.replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `${safeName}.md`;
            const outputFile = vscode.Uri.file(path.join(outputDir, fileName));

            await vscode.workspace.fs.writeFile(outputFile, new TextEncoder().encode(markdown));
            generatedFiles.push(outputFile);

            progress.report({
              increment: (50 / validFlows.length),
              message: `Generated ${i + 1}/${validFlows.length}: ${safeName}`
            });
          }

          progress.report({ increment: 100 });

          const choice = await vscode.window.showInformationMessage(
            `✅ Generated ${validFlows.length} flow documentation file(s)`,
            'Open Folder',
            'Open First File'
          );

          if (choice === 'Open Folder') {
            vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputDir));
          } else if (choice === 'Open First File' && generatedFiles.length > 0) {
            const doc = await vscode.workspace.openTextDocument(generatedFiles[0]);
            await vscode.window.showTextDocument(doc, { preview: false });
            await vscode.commands.executeCommand('markdown.showPreview', generatedFiles[0]);
          }
        }
      });
    } catch (err: any) {
      vscode.window.showErrorMessage(`Documentation generation failed: ${err.message}`);
    }
  }

  private async fixFlows() {
    let results: core.ScanResult[] = CacheProvider.instance.get('results') || [];
    if (results.length > 0) {
      const use = await vscode.window.showQuickPick(
        ['Use last scan results', 'Select different files to fix'],
        { placeHolder: `Found ${results.length} scan result(s) from previous run` }
      );
      if (use === 'Select different files to fix') results = [];
      else if (use === undefined) return;
    }
    if (results.length === 0) {
      const root = vscode.workspace.workspaceFolders![0].uri;
      const config = await this.loadConfig(root.fsPath);
      const uris = await this.selectFlows('Select flow files to fix:', config.ignore);
      if (!uris) return;
      if (Object.keys(config.rules).length === 0) {
        const choice = await vscode.window.showWarningMessage(
          'No rules configured. Run "Configure Rules" first?',
          'Configure Now',
          'Fix Anyway'
        );
        if (choice === 'Configure Now') {
          await this.configRules();
          return;
        }
      }
      const parsed = await core.parse(toFsPaths(uris));
      results = core.scan(parsed, { rules: config.rules, betamode: config.betamode });
    }
    if (results.length === 0) {
      vscode.window.showInformationMessage('No issues to fix.');
      ScanOverview.createOrShow(this.context.extensionUri, []);
      return;
    }
    ScanOverview.createOrShow(this.context.extensionUri, results);
    const fixed = core.fix(results);
    for (const r of fixed) {
      await new SaveFlow().execute(r.flow, vscode.Uri.file(r.flow.fsPath));
    }
    await CacheProvider.instance.set('results', fixed);
    ScanOverview.createOrShow(this.context.extensionUri, fixed.length ? fixed : results);
  }

  private async selectFlows(prompt: string, configIgnore?: string[]): Promise<vscode.Uri[] | undefined> {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!root) {
      vscode.window.showErrorMessage('No workspace folder open.');
      return;
    }
    const paths = await new SelectFlows(root, prompt).execute(root, configIgnore);
    if (!paths.length) {
      vscode.window.showInformationMessage('No flow files selected.');
      return;
    }
    return toUris(paths);
  }

  private async pickOutputDirectory(defaultDir: string): Promise<string | undefined> {
    const uri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      defaultUri: vscode.Uri.file(defaultDir),
      openLabel: 'Select output folder'
    });

    return uri?.[0]?.fsPath;
  }

}