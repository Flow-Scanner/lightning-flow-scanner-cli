import { SfCommand, Flags } from "@salesforce/sf-plugins-core";
import { Messages } from "@salesforce/core";
import * as readline from "node:readline";

import { ScanResult } from "../../models/ScanResult.js";
import CoreFixService from "../../libs/CoreFixService.js";
import { loadScannerOptions } from "../../libs/ScannerConfig.js";

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url, true);

const commandMessages = Messages.loadMessages(
  "lightning-flow-scanner",
  "fix-command",
);

export default class FlowFix extends SfCommand<ScanResult> {
  static override description =
    commandMessages.getMessage("commandDescription");

  static override examples = [
    "<%= config.bin %> <%= command.id %> -d src/flows",
    "<%= config.bin %> <%= command.id %> -d src/flows --dry-run",
    "<%= config.bin %> <%= command.id %> -d src/flows -i",
    "<%= config.bin %> <%= command.id %> -d src/flows -r unused-variable",
  ];

  public static override flags = {
    config: Flags.file({
      char: "c",
      description: "Path to configuration file",
      required: false,
    }),
    rules: Flags.string({
      multiple: true,
      char: "r",
      description: "Filter to specific rules (optional, uses config if not specified)",
      required: false,
    }),
    dir: Flags.string({
      char: "d",
      multiple: true,
      description: commandMessages.getMessage("flagsDirsDescription"),
      exclusive: ["files"],
    }),
    files: Flags.file({
      exists: true,
      multiple: true,
      description: commandMessages.getMessage("flagsFilesDescription"),
      char: "f",
      charAliases: ["p"],
    }),
    "dry-run": Flags.boolean({
      description: "Preview changes without applying them",
      default: false,
    }),
    interactive: Flags.boolean({
      char: "i",
      description: "Show diff and prompt for confirmation before applying",
      default: false,
    }),
  };

  public async run(): Promise<ScanResult> {
    const { flags } = await this.parse(FlowFix);
    const { dir, files, rules } = flags;
    const dryRun = flags["dry-run"];
    const interactive = flags.interactive;

    // Default to current directory if neither dir nor files specified (like scan command)
    const searchDirectory = dir?.[0] ?? (files && files.length > 0 ? files[0] : ".");
    const config = await loadScannerOptions(flags.config, {}, searchDirectory);

    // Use dir, files, or default to current directory
    const effectiveDir = dir ?? (files ? undefined : ["."]);
    const fixService = new CoreFixService(effectiveDir, files, config, rules);

    // Legacy behavior: just fix immediately (no preview/prompt)
    if (!dryRun && !interactive) {
      this.spinner.start("Loading Lightning Flow Scanner", null, { stdout: true });
      const fixedPaths = await fixService.fix();
      if (fixedPaths.length === 0) {
        this.spinner.stop("No auto-fixable issues found.");
        return { summary: { message: "No fixes needed" } } as ScanResult;
      }
      this.spinner.stop(`Fix Complete.. Fixed ${fixedPaths.join(", ")}`);
      return { summary: { message: `Fixed ${fixedPaths.join(", ")}` } } as ScanResult;
    }

    // Interactive or dry-run: show preview
    this.spinner.start("Scanning flows...", null, { stdout: true });
    const preview = await fixService.preview();
    this.spinner.stop();

    if (preview.fixes.length === 0) {
      this.log("No auto-fixable issues found.");
      return { summary: { message: "No fixes needed" } } as ScanResult;
    }

    // Show summary
    this.log(`\nFound ${preview.totalFixes} fix(es) in ${preview.fixes.length} flow(s):\n`);
    for (const fix of preview.fixes) {
      this.log(`  ${fix.flowName}`);
      for (const rule of fix.rules) {
        this.log(`    - ${rule.ruleId}: ${rule.count} issue(s)`);
      }
    }

    // Show diff
    this.log("\n" + "─".repeat(60) + "\n");
    for (const fix of preview.fixes) {
      this.log(`\x1b[1m${fix.flowName}\x1b[0m`);
      this.log(fix.diff);
      this.log("");
    }

    if (dryRun) {
      this.log("Dry run complete. No changes were made.");
      return {
        summary: { message: `Would fix ${preview.totalFixes} issue(s) in ${preview.fixes.length} flow(s)` },
      } as ScanResult;
    }

    // Interactive: prompt for confirmation
    const confirmed = await this.promptForConfirmation();
    if (!confirmed) {
      this.log("Fix cancelled.");
      return { summary: { message: "Cancelled" } } as ScanResult;
    }

    // Apply fixes
    this.spinner.start("Applying fixes...", null, { stdout: true });
    const fixedPaths = await fixService.apply();
    this.spinner.stop(`Fixed ${fixedPaths.length} flow(s).`);

    return {
      summary: { message: `Fixed ${fixedPaths.join(", ")}` },
    } as ScanResult;
  }

  private async promptForConfirmation(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("\nApply these fixes? [y/N] ", (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
      });
    });
  }
}
