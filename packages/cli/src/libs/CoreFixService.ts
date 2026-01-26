import { writeFileSync, readFileSync } from "node:fs";
import * as path from "node:path";

import { FindFlows } from "./FindFlows.js";
import { ScannerOptions } from "./ScannerConfig.js";
import pkg from "@flow-scanner/lightning-flow-scanner-core";
const { scan, parse, fix: fixFlows } = pkg;

import type { ScanResult as FlowScanResults, IRulesConfig } from "@flow-scanner/lightning-flow-scanner-core";

export interface FixPreview {
  totalFixes: number;
  fixes: Array<{
    flowPath: string;
    flowName: string;
    rules: Array<{ ruleId: string; count: number }>;
    diff: string;
  }>;
}

export default class CoreFixService {
  private fixedFlows: FlowScanResults[] | null = null;
  private originalContents: Map<string, string> = new Map();

  public constructor(
    private readonly dir: string[] | undefined,
    private readonly file: string[] | undefined,
    private readonly config: ScannerOptions,
    private readonly ruleFilter?: string[],
  ) {}

  public async preview(): Promise<FixPreview> {
    // Find and parse flow files
    const flowFiles = this.findFlows();
    const parsedFlows = await parse(flowFiles);

    // Store original contents for diff
    for (const flowFile of flowFiles) {
      this.originalContents.set(flowFile, readFileSync(flowFile, "utf-8"));
    }

    // Build scan config from loaded config
    const scanConfig: IRulesConfig = {
      rules: this.config.rules ?? {},
      betaMode: this.config.betaMode ?? false,
      ignoreFlows: this.config.ignoreFlows,
      exceptions: this.config.exceptions,
    };

    // Scan and fix
    const scanResults: FlowScanResults[] = scan(parsedFlows, scanConfig);
    let fixed = fixFlows(scanResults);

    // If rule filter provided, only keep fixes for those rules
    if (this.ruleFilter && this.ruleFilter.length > 0) {
      const filterSet = new Set(this.ruleFilter.map(r => r.toLowerCase()));
      fixed = fixed.map(f => ({
        ...f,
        ruleResults: f.ruleResults.filter(rr =>
          filterSet.has(rr.ruleId.toLowerCase()) || filterSet.has(rr.ruleName.toLowerCase())
        ),
      })).filter(f => f.ruleResults.length > 0);
    }

    this.fixedFlows = fixed;

    // Build preview
    let totalFixes = 0;
    const fixes: FixPreview["fixes"] = [];

    for (const fixed of this.fixedFlows) {
      const flowPath = fixed.flow.fsPath;
      const flowName = path.basename(flowPath);
      const original = this.originalContents.get(flowPath) || "";
      const newContent = fixed.flow.toXMLString();

      // Count fixes per rule
      const ruleCounts = new Map<string, number>();
      for (const rr of fixed.ruleResults) {
        if (rr.details.length > 0) {
          ruleCounts.set(rr.ruleId, (ruleCounts.get(rr.ruleId) || 0) + rr.details.length);
          totalFixes += rr.details.length;
        }
      }

      const rules = Array.from(ruleCounts.entries()).map(([ruleId, count]) => ({
        ruleId,
        count,
      }));

      // Generate unified diff
      const diff = this.generateDiff(original, newContent, flowName);

      fixes.push({ flowPath, flowName, rules, diff });
    }

    return { totalFixes, fixes };
  }

  public async apply(): Promise<string[]> {
    if (!this.fixedFlows) {
      throw new Error("Must call preview() before apply()");
    }

    for (const fixed of this.fixedFlows) {
      writeFileSync(fixed.flow.fsPath, fixed.flow.toXMLString());
    }

    return this.fixedFlows.map((f) => f.flow.fsPath);
  }

  // Legacy method for backwards compatibility
  public async fix(): Promise<string[]> {
    await this.preview();
    return this.apply();
  }

  private generateDiff(original: string, modified: string, fileName: string): string {
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");

    const diff: string[] = [];
    diff.push(`\x1b[1m--- a/${fileName}\x1b[0m`);
    diff.push(`\x1b[1m+++ b/${fileName}\x1b[0m`);

    // Simple line-by-line diff (finds removed and added lines)
    const originalSet = new Set(originalLines);
    const modifiedSet = new Set(modifiedLines);

    const removed = originalLines.filter((line) => !modifiedSet.has(line));
    const added = modifiedLines.filter((line) => !originalSet.has(line));

    if (removed.length === 0 && added.length === 0) {
      return "  (no changes)";
    }

    // Show context around changes
    let inChange = false;
    let contextBuffer: string[] = [];
    const CONTEXT_LINES = 2;

    for (let i = 0; i < originalLines.length; i++) {
      const line = originalLines[i];
      const isRemoved = removed.includes(line);

      if (isRemoved) {
        // Flush context buffer
        if (!inChange && contextBuffer.length > 0) {
          diff.push(`@@ -${Math.max(1, i - contextBuffer.length + 1)} @@`);
          for (const ctx of contextBuffer) {
            diff.push(`  ${ctx}`);
          }
        }
        inChange = true;
        contextBuffer = [];
        diff.push(`\x1b[31m- ${line}\x1b[0m`);
      } else if (inChange) {
        // Show trailing context
        contextBuffer.push(line);
        if (contextBuffer.length <= CONTEXT_LINES) {
          diff.push(`  ${line}`);
        }
        if (contextBuffer.length >= CONTEXT_LINES) {
          inChange = false;
          contextBuffer = [];
        }
      } else {
        // Keep rolling context
        contextBuffer.push(line);
        if (contextBuffer.length > CONTEXT_LINES) {
          contextBuffer.shift();
        }
      }
    }

    // Show added lines
    if (added.length > 0) {
      diff.push("");
      diff.push(`\x1b[32m+ ${added.length} line(s) added (condensed view)\x1b[0m`);
    }

    return diff.join("\n");
  }

  private findFlows(): string[] {
    if (this.dir) {
      return this.findFlowsByDir(this.dir);
    }
    return this.findFlowsByPath(this.file);
  }

  private findFlowsByDir(dir: string[]): string[] {
    return dir
      .map((dirName) => {
        return FindFlows(dirName, this.config.ignore);
      })
      .flat(1);
  }

  private findFlowsByPath(filePaths: string[]): string[] {
    return [...filePaths];
  }
}
