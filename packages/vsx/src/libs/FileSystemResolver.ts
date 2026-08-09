import * as path from "path";
import { promises as fs } from "fs";
import { FindFlows } from "./FindFlows";
import {
  parse,
  Flow,
  type SubflowResolver,
  type ResolvedSubflow,
} from "@flow-scanner/lightning-flow-scanner-core";

/** Pattern to validate Salesforce Flow XML structure */
const FLOW_ROOT_PATTERN = /<Flow\s+xmlns=/;

export interface FileSystemResolverOptions {
  /** Base directories to search for flows */
  searchPaths: string[];
  /** Patterns to ignore */
  ignorePatterns?: string[];
  /** Whether to eagerly load all flows on init. Defaults to true: rules resolve
   * subflows synchronously via getSync(), which only sees loaded flows — lazy
   * mode silently disables cross-flow analysis unless loadAll() is called. */
  eager?: boolean;
  /** Skip managed packages (flows with namespace prefix). Default: true */
  skipManaged?: boolean;
}

/**
 * Resolves subflows from the local filesystem.
 * For use in VS Code extension (Node.js environment).
 *
 * Search paths are fixed at construction time for security.
 */
export class FileSystemResolver implements SubflowResolver {
  private flowIndex: Map<string, string> = new Map(); // flowName -> filePath
  private loadedFlows: Map<string, Flow> = new Map(); // flowName -> Flow
  private managedFlows: Set<string> = new Set(); // flowNames that are managed
  private options: FileSystemResolverOptions;

  private constructor(options: FileSystemResolverOptions) {
    this.options = {
      skipManaged: true,
      eager: true,
      ...options,
    };
  }

  /**
   * Create and initialize a FileSystemResolver.
   */
  static async create(options: FileSystemResolverOptions): Promise<FileSystemResolver> {
    const resolver = new FileSystemResolver(options);
    await resolver.buildIndex();

    if (resolver.options.eager) {
      await resolver.loadAll();
    }

    return resolver;
  }

  /**
   * Create a resolver from a single directory.
   */
  static async fromDirectory(dir: string, ignorePatterns?: string[]): Promise<FileSystemResolver> {
    return FileSystemResolver.create({
      searchPaths: [dir],
      ignorePatterns,
    });
  }

  /**
   * Create a resolver from a parent flow's location.
   */
  static async fromFlow(flow: Flow, additionalPaths?: string[]): Promise<FileSystemResolver> {
    const searchPaths: string[] = [];

    if (flow.fsPath) {
      searchPaths.push(path.dirname(flow.fsPath));
    } else if (flow.uri) {
      searchPaths.push(path.dirname(flow.uri));
    }

    if (additionalPaths) {
      searchPaths.push(...additionalPaths);
    }

    return FileSystemResolver.create({ searchPaths });
  }

  /**
   * Build index of available flow files.
   */
  private async buildIndex(): Promise<void> {
    this.flowIndex.clear();
    this.managedFlows.clear();

    for (const searchPath of this.options.searchPaths) {
      const flowFiles = FindFlows(searchPath, this.options.ignorePatterns);

      for (const filePath of flowFiles) {
        const flowName = this.extractFlowName(filePath);
        if (!flowName) continue;

        // Check if managed (has namespace prefix like "ns__FlowName")
        const isManaged = flowName.includes("__");
        if (isManaged) {
          this.managedFlows.add(flowName);
          if (this.options.skipManaged) continue;
        }

        if (!this.flowIndex.has(flowName)) {
          this.flowIndex.set(flowName, filePath);
        }
      }
    }
  }

  /**
   * Extract flow API name from file path.
   */
  private extractFlowName(filePath: string): string | null {
    let baseName = path.basename(filePath);

    if (baseName.endsWith(".flow-meta.xml")) {
      baseName = baseName.slice(0, -14);
    } else if (baseName.endsWith(".flow")) {
      baseName = baseName.slice(0, -5);
    } else {
      return null;
    }

    return baseName || null;
  }

  /**
   * Validate that file content appears to be a Salesforce Flow XML.
   * Checks for <Flow xmlns= pattern to prevent parsing arbitrary XML files.
   */
  private async validateFlowContent(filePath: string): Promise<boolean> {
    let fd: fs.FileHandle | undefined;
    try {
      // Read only the first 1KB to check for Flow root element
      fd = await fs.open(filePath, "r");
      const buffer = Buffer.alloc(1024);
      await fd.read(buffer, 0, 1024, 0);
      const header = buffer.toString("utf8");
      return FLOW_ROOT_PATTERN.test(header);
    } catch {
      return false;
    } finally {
      await fd?.close();
    }
  }

  /**
   * Load a flow from the filesystem.
   */
  private async loadFlow(flowName: string): Promise<Flow | undefined> {
    if (this.loadedFlows.has(flowName)) {
      return this.loadedFlows.get(flowName);
    }

    const filePath = this.flowIndex.get(flowName);
    if (!filePath) return undefined;

    try {
      // Validate file appears to be a Salesforce Flow before parsing
      const isValid = await this.validateFlowContent(filePath);
      if (!isValid) {
        console.warn(`Skipping "${flowName}": file does not appear to be a valid Salesforce Flow`);
        return undefined;
      }

      const parsed = await parse([filePath]);
      if (parsed.length > 0 && parsed[0].flow) {
        this.loadedFlows.set(flowName, parsed[0].flow);
        return parsed[0].flow;
      }
    } catch (error) {
      console.warn(`Failed to load subflow "${flowName}" from ${filePath}:`, error);
    }

    return undefined;
  }

  /**
   * Load all indexed flows.
   */
  async loadAll(): Promise<void> {
    const flowNames = Array.from(this.flowIndex.keys());
    await Promise.all(flowNames.map((name) => this.loadFlow(name)));
  }

  async resolve(flowName: string): Promise<ResolvedSubflow> {
    const isManaged = this.managedFlows.has(flowName);

    if (isManaged && this.options.skipManaged) {
      return {
        flowName,
        flow: undefined,
        isManaged: true,
        error: "Managed package flow - skipped",
      };
    }

    const flow = await this.loadFlow(flowName);

    return {
      flowName,
      flow,
      isManaged,
      error: flow ? undefined : `Flow "${flowName}" not found in search paths`,
    };
  }

  async resolveMany(flowNames: string[]): Promise<Map<string, ResolvedSubflow>> {
    const results = new Map<string, ResolvedSubflow>();

    await Promise.all(
      flowNames.map(async (name) => {
        results.set(name, await this.resolve(name));
      })
    );

    return results;
  }

  has(flowName: string): boolean {
    if (this.options.skipManaged && this.managedFlows.has(flowName)) {
      return false;
    }
    return this.flowIndex.has(flowName);
  }

  getAvailableFlows(): string[] {
    return Array.from(this.flowIndex.keys());
  }

  get size(): number {
    return this.flowIndex.size;
  }

  get loadedCount(): number {
    return this.loadedFlows.size;
  }

  clearCache(): void {
    this.loadedFlows.clear();
  }

  async refresh(): Promise<void> {
    this.loadedFlows.clear();
    await this.buildIndex();
  }

  /**
   * Get a flow synchronously if already loaded/cached.
   * Returns undefined if flow needs async loading.
   * For FileSystemResolver, flows must be pre-loaded via loadAll() or eager mode.
   * @param flowName - The API name of the subflow
   * @returns The Flow if already loaded, undefined otherwise
   */
  getSync(flowName: string): Flow | undefined {
    return this.loadedFlows.get(flowName);
  }
}
