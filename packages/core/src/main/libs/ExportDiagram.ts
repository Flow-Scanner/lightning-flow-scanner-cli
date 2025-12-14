import { Flow } from "../models/Flow";
import { ParsedFlow } from "../models/ParsedFlow";

export interface DiagramOptions {
  includeDetails?: boolean;
  includeMarkdownDocs?: boolean;
  collapsedDetails?: boolean;
}

/**
 * Generate Markdown documentation for parsed flows, including Mermaid diagrams for valid flows.
 * 
 * This function can be chained after parse() to generate documentation.
 * It filters out errored parses and only documents valid flows.
 * 
 * @param parsedFlows Array of ParsedFlow objects from parse()
 * @param options Visualization options for Mermaid diagrams
 * 
 * @returns Markdown string with documentation
 * 
 * @example
 * ```typescript
 * // Node.js usage
 * import { parse, exportFlowMarkdown } from "@flow-scanner/lightning-flow-scanner-core";
 * import fs from "fs/promises";
 * 
 * const parsed = await parse(["flows/*.xml"]);
 * const md = exportFlowMarkdown(parsed, {
 *   includeDetails: true,
 *   includeMarkdownDocs: true,
 *   collapsedDetails: true
 * });
 * await fs.writeFile("flow-doc.md", md);
 * ```
 * 
 * @example
 * ```typescript
 * // Chained (async/await)
 * const md = await parse(["flows/*.xml"]).then(parsed => 
 *   exportFlowMarkdown(parsed, { includeDetails: true })
 * );
 * ```
 */
export function exportDiagram(
  parsedFlows: ParsedFlow[],
  options: DiagramOptions = {
    includeDetails: true,
    includeMarkdownDocs: true,
    collapsedDetails: true
  }
): string {
  const validFlows = parsedFlows.filter(p => p.flow).map(p => p.flow!);
  
  let markdown = "# Flow Documentation\n\n";
  
  if (validFlows.length === 0) {
    markdown += "No valid flows found.\n\n";
  }
  
  for (const flow of validFlows) {
    markdown += `## ${flow.name}\n\n`;
    
    const vizOptions = {
      includeDetails: options.includeDetails,
      includeMarkdownDocs: options.includeMarkdownDocs,
      collapsedDetails: options.collapsedDetails
    };
    
    markdown += flow.visualize("mermaid", vizOptions) + "\n\n";
  }
  
  // Optionally add errors section if any
  const errors = parsedFlows.filter(p => p.errorMessage);
  if (errors.length > 0) {
    markdown += "## Parse Errors\n\n";
    for (const err of errors) {
      markdown += `- ${err.uri}: ${err.errorMessage}\n`;
    }
    markdown += "\n";
  }
  
  return markdown;
}