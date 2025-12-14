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

interface RuleEntry {
  severity: string;
  expression?: string;
}

type RuleConfig = Record<string, RuleEntry>;

export default class Commands {
  constructor(private context: vscode.ExtensionContext) { }

  get handlers() {
    const rawHandlers: Record<string, (...args: any[]) => any> = {
'flowscanner.openDocumentation': () => this.openDocumentation(),
      'flowscanner.configRules': () => this.configRules(),
      'flowscanner.scanFlows': () => this.scanFlows(),
      'flowscanner.generateFlowDocs': () => this.generateFlowDocs(),
      'flowscanner.fixFlows': () => this.fixFlows(),      
    };
    return Object.entries(rawHandlers).map(([command, handler]) => {
      return [command, async (...args: any[]) => handler(...args)] as const;
    });
  }

  private openDocumentation() {
    const url = vscode.Uri.parse('https://github.com/Flow-Scanner/lightning-flow-scanner-core?tab=readme-ov-file#default-rules');
    vscode.env.openExternal(url);
  }

  private async loadConfig(workspacePath: string): Promise<{ rules: RuleConfig; betamode: boolean }> {
    const rawConfig = await loadScannerConfig(workspacePath);
    // OutputChannel.getInstance().logChannel.debug('Raw config loaded:', JSON.stringify(rawConfig, null, 2));
    const rawRules = (rawConfig.rules as Record<string, unknown>) || {};
    const rules: RuleConfig = {};
    for (const [name, rule] of Object.entries(rawRules)) {
      if (typeof rule === 'object' && rule !== null) {
        const r = rule as Record<string, unknown>;
        rules[name] = {
          severity: String(r.severity ?? 'warning'),
          expression: r.expression !== undefined ? String(r.expression) : undefined
        };
      }
    }
    const betamode = !!rawConfig.betamode;
    await CacheProvider.instance.set('ruleconfig', { rules, betamode });
    return { rules, betamode };
  }

  private async saveConfig(workspacePath: string, rules: RuleConfig, betamode: boolean) {
    const configPath = path.join(workspacePath, '.flow-scanner.yml');
    const yamlLines: string[] = [];
    if (betamode) {
      yamlLines.push('betamode: true');
    }
    yamlLines.push('rules:');
    for (const [name, rule] of Object.entries(rules)) {
      yamlLines.push(`  ${name}:`); // 2 spaces
      yamlLines.push(`    severity: ${rule.severity}`); // 4 spaces
      if (rule.expression) {
        yamlLines.push(`    expression: ${JSON.stringify(rule.expression)}`); // 4 spaces
      }
    }
    const yamlString = yamlLines.join('\n');
    await vscode.workspace.fs.writeFile(vscode.Uri.file(configPath), new TextEncoder().encode(yamlString));
    await CacheProvider.instance.set('ruleconfig', { rules, betamode });
  }

  private async configRules(): Promise<boolean> {
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (!ws) {
      vscode.window.showErrorMessage('No workspace folder found.');
      return false;
    }
    const workspacePath = ws.uri.fsPath;
    const configPath = path.join(workspacePath, '.flow-scanner.yml');
    // Check if config file exists and offer to open it
    try {
      await vscode.workspace.fs.stat(vscode.Uri.file(configPath));
      // File exists - ask user what they want to do
      const choice = await vscode.window.showQuickPick(
        ['Open Config File', 'Reconfigure Rules'],
        {
          placeHolder: 'Configuration file exists. What would you like to do?'
        }
      );
      if (choice === undefined) return false;
      if (choice === 'Open Config File') {
        const doc = await vscode.workspace.openTextDocument(configPath);
        await vscode.window.showTextDocument(doc);
        return false; // User just opened file, didn't configure
      }
      // Otherwise continue with reconfiguration
    } catch {
      // File doesn't exist, continue with normal flow
    }
    const config = await this.loadConfig(workspacePath);
    let rules = config.rules;
    let currentBetamode = config.betamode;
    const betaOptions = currentBetamode ? ['Yes', 'No'] : ['No', 'Yes'];
    const includeBeta = await vscode.window.showQuickPick(betaOptions, {
      placeHolder: 'Do you want to opt-in for beta rules?'
    });
    if (includeBeta === undefined) return false;
    const betamode = includeBeta === 'Yes';
    const allRules = [...core.getRules()];
    const currentNames = Object.keys(rules);
    // Preselect all rules if no config exists
    const isEmptyConfig = currentNames.length === 0;
    const items = allRules.map(rule => ({
      label: rule.label,
      description: rule.name,
      picked: isEmptyConfig ? true : currentNames.includes(rule.name),
    }));
    const selected = await vscode.window.showQuickPick(items, {
      canPickMany: true,
      placeHolder: 'Select rules to enable/disable',
    });
    if (selected === undefined) return false;
    const newRules: RuleConfig = {};
    for (const item of selected) {
      const def = allRules.find(r => r.name === item.description)!;
      const existing = rules[def.name];
      newRules[def.name] = {
        severity: existing?.severity || def.severity || 'warning',
        expression: existing?.expression,
      };
    }
    let changed = false;
    if (newRules.FlowName) {
      const current = newRules.FlowName.expression || '';
      const expr = await vscode.window.showInputBox({
        prompt: 'Define naming convention (REGEX) for FlowName',
        placeHolder: '[A-Za-z0-9]+_[A-Za-z0-9]+',
        value: current || '[A-Za-z0-9]+_[A-Za-z0-9]+',
      });
      if (expr !== undefined && expr.trim() !== current) {
        newRules.FlowName.expression = expr.trim() || undefined;
        changed = true;
      }
    }
    if (newRules.APIVersion) {
      const current = newRules.APIVersion.expression || '';
      const expr = await vscode.window.showInputBox({
        prompt: 'Set API version rule (e.g. ">=50")',
        placeHolder: '>=50',
        value: current || '>=50',
      });
      if (expr !== undefined && expr.trim() !== current) {
        newRules.APIVersion.expression = expr.trim() || undefined;
        changed = true;
      }
    }
    if (changed || Object.keys(newRules).length !== currentNames.length || betamode !== currentBetamode) {
      await this.saveConfig(workspacePath, newRules, betamode);
      vscode.window.showInformationMessage('Configuration saved successfully!');
      return true; // Configuration was completed
    }
    return false; // No changes made
  }

  private async scanFlows() {
    const selectedUris = await this.selectFlows('Select flow files or folder to scan:');
    if (!selectedUris) return;
    const root = vscode.workspace.workspaceFolders![0].uri;
    
    const configReset = vscode.workspace.getConfiguration('flowscanner').get<boolean>('Reset');
    if (configReset) await this.configRules();
    
    // Load config dynamically from YAML file
    let config = await this.loadConfig(root.fsPath);
    
    if (Object.keys(config.rules).length === 0) {
      const choice = await vscode.window.showWarningMessage(
        'No rules configured. Run "Configure Rules" first?',
        'Configure Now',
        'Scan Anyway'
      );
      
      if (choice === 'Configure Now') {
        const configured = await this.configRules();
        
        if (!configured) {
          // User cancelled or just opened file
          return;
        }
        
        // RELOAD config after configuration
        config = await this.loadConfig(root.fsPath);
        
        // If still no rules, something went wrong
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
    const scanConfig = { rules: config.rules, betamode: config.betamode };
    const parsed = await core.parse(toFsPaths(selectedUris));
    const results = core.scan(parsed, scanConfig);
    await CacheProvider.instance.set('results', results);
    ScanOverview.createOrShow(this.context.extensionUri, results);
  }
  
  private async generateFlowDocs() {
  const selectedUris = await this.selectFlows('Select flow files or folder to document:');
  if (!selectedUris) return;

  // Quick pick for documentation options
  const mode = await vscode.window.showQuickPick(
    [
      { label: '📄 Single Combined Document', value: 'combined' },
      { label: '📚 Separate Document Per Flow', value: 'separate' }
    ],
    { placeHolder: 'How would you like to generate documentation?' }
  );
  
  if (!mode) return;

  const includeDetails = await vscode.window.showQuickPick(
    ['Yes', 'No'],
    { placeHolder: 'Include detailed node information?' }
  );
  
  if (includeDetails === undefined) return;

  const collapsedDetails = includeDetails === 'Yes' 
    ? await vscode.window.showQuickPick(
        ['Yes', 'No'],
        { placeHolder: 'Collapse details by default?' }
      )
    : 'No';
  
  if (collapsedDetails === undefined) return;

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

      const options = {
        includeDetails: includeDetails === 'Yes',
        includeMarkdownDocs: true,
        collapsedDetails: collapsedDetails === 'Yes',
      };

      // Create output directory
      const tempDir = path.join(this.context.globalStorageUri.fsPath, 'flow-docs');
      await vscode.workspace.fs.createDirectory(vscode.Uri.file(tempDir));

      if (mode.value === 'combined') {
        // Generate single combined document
        const markdown = core.exportDiagram(parsed, options);
        
        const fileName = `Flow_Documentation_${Date.now()}.md`;
        const outputFile = vscode.Uri.file(path.join(tempDir, fileName));
        
        await vscode.workspace.fs.writeFile(
          outputFile, 
          new TextEncoder().encode(markdown)
        );

        progress.report({ increment: 100 });

        // Open in preview
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
        // Generate separate documents
        const generatedFiles: vscode.Uri[] = [];
        
        for (let i = 0; i < validFlows.length; i++) {
          const pf = validFlows[i];
          const singleParsed = [pf];
          const markdown = core.exportDiagram(singleParsed, options);
          
          const safeName = pf.flow!.name.replace(/[^a-zA-Z0-9_-]/g, '_');
          const fileName = `${safeName}.md`;
          const outputFile = vscode.Uri.file(path.join(tempDir, fileName));
          
          await vscode.workspace.fs.writeFile(
            outputFile,
            new TextEncoder().encode(markdown)
          );
          
          generatedFiles.push(outputFile);
          
          progress.report({ 
            increment: (50 / validFlows.length),
            message: `Generated ${i + 1}/${validFlows.length}: ${safeName}` 
          });
        }

        progress.report({ increment: 100 });

        // Show success and offer to open folder
        const choice = await vscode.window.showInformationMessage(
          `✅ Generated ${validFlows.length} flow documentation file(s)`,
          'Open Folder',
          'Open First File'
        );

        if (choice === 'Open Folder') {
          vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(tempDir));
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
      const uris = await this.selectFlows('Select flow files to fix:');
      if (!uris) return;
      const root = vscode.workspace.workspaceFolders![0].uri;
      const config = await this.loadConfig(root.fsPath);
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

  private async selectFlows(prompt: string): Promise<vscode.Uri[] | undefined> {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!root) {
      vscode.window.showErrorMessage('No workspace folder open.');
      return;
    }
    const paths = await new SelectFlows(root, prompt).execute(root);
    if (!paths.length) {
      vscode.window.showInformationMessage('No flow files selected.');
      return;
    }
    return toUris(paths);
  }
}