import { FlowNode } from "./FlowNode";
import { Compiler } from "../libs/Compiler";

/**
 * FlowGraph: Pre-computed connectivity cache built using Compiler.
 * Built once during Flow.preProcessNodes() to avoid repeated traversals.
 *
 * Uses the existing Compiler to build the graph - no duplicate logic!
 */
export class FlowGraph {
  // Fast lookups by element name
  private nodeMap: Map<string, FlowNode> = new Map();

  // Pre-computed sets for common queries (built using Compiler)
  private reachableFromStart: Set<string> = new Set();
  private elementsInLoop: Map<string, string> = new Map(); // element -> loop name

  // Connector metadata (extracted during node processing)
  private faultConnectors: Map<string, Set<string>> = new Map();
  private normalConnectors: Map<string, Set<string>> = new Map();
  private allConnectors: Map<string, Set<string>> = new Map();
  private reverseConnectors: Map<string, Set<string>> = new Map();

  constructor(nodes: FlowNode[], startReference?: string, startNode?: FlowNode) {
    this.buildNodeMaps(nodes);
    this.buildConnectorMaps(nodes);

    // ALWAYS ensure START node edges exist
    if (startNode) {
      // Old flows: use explicit <start> element connectors
      this.addStartNodeConnectors(startNode);
    } else if (startReference) {
      // New flows: direct edge from START to startElementReference
      this.addStartEdgeFromReference(startReference);
    }

    this.computeLoopBoundaries();
    if (startReference) {
      this.computeReachability(startReference);
    }
  }

  /**
   * Add START node connectors to the connector maps (for flows with explicit <start> element)
   */
  private addStartNodeConnectors(startNode: FlowNode): void {
    const startName = 'START';
    
    this.faultConnectors.set(startName, new Set());
    this.normalConnectors.set(startName, new Set());
    this.allConnectors.set(startName, new Set());
    
    if (!startNode.connectors || startNode.connectors.length === 0) return;
    
    for (const connector of startNode.connectors) {
      const targetRef = connector.connectorTargetReference?.targetReference ?? connector.reference;
      if (!targetRef) continue;
      
      // START node typically has normal connectors, not fault connectors
      this.normalConnectors.get(startName)?.add(targetRef);
      this.allConnectors.get(startName)?.add(targetRef);
      
      // Build reverse map
      if (!this.reverseConnectors.has(targetRef)) {
        this.reverseConnectors.set(targetRef, new Set());
      }
      this.reverseConnectors.get(targetRef)?.add(startName);
    }
  }

  /**
   * Add START edge for newer flows that use startElementReference (no explicit <start> node)
   */
  private addStartEdgeFromReference(startReference: string): void {
    const startName = 'START';
    
    this.faultConnectors.set(startName, new Set());
    this.normalConnectors.set(startName, new Set());
    this.allConnectors.set(startName, new Set());
    
    // Direct edge: START --> first element
    this.normalConnectors.get(startName)?.add(startReference);
    this.allConnectors.get(startName)?.add(startReference);
    
    // Build reverse map
    if (!this.reverseConnectors.has(startReference)) {
      this.reverseConnectors.set(startReference, new Set());
    }
    this.reverseConnectors.get(startReference)?.add(startName);
  }

  /**
   * Build node map for O(1) lookups
   */
  private buildNodeMaps(nodes: FlowNode[]): void {
    for (const node of nodes) {
      this.nodeMap.set(node.name, node);
    }
  }

  /**
   * Build connector maps by inspecting node connectors
   */
  private buildConnectorMaps(nodes: FlowNode[]): void {
    for (const node of nodes) {
      this.faultConnectors.set(node.name, new Set());
      this.normalConnectors.set(node.name, new Set());
      this.allConnectors.set(node.name, new Set());
      if (!node.connectors || node.connectors.length === 0) continue;
      for (const connector of node.connectors) {
        const targetRef = connector.connectorTargetReference?.targetReference ?? connector.reference;
        if (!targetRef) continue;
        // Categorize by connector type
        if (connector.type === "faultConnector") {
          this.faultConnectors.get(node.name)?.add(targetRef);
        } else {
          this.normalConnectors.get(node.name)?.add(targetRef);
        }
        this.allConnectors.get(node.name)?.add(targetRef);
        // Build reverse map for "previous elements" queries
        if (!this.reverseConnectors.has(targetRef)) {
          this.reverseConnectors.set(targetRef, new Set());
        }
        this.reverseConnectors.get(targetRef)?.add(node.name);
      }
    }
  }

  /**
   * Use Compiler to compute which elements are reachable from start.
   * This reuses the existing IDDFS traversal logic!
   */
  private computeReachability(startReference: string): void {
    const compiler = new Compiler();
    compiler.traverseFlow(startReference, (element) => {
      this.reachableFromStart.add(element.name);
    }, this.nodeMap, this.allConnectors);
  }

  /**
   * Use Compiler to compute which elements are inside loops.
   * Calls Compiler.traverseFlow() for each loop with endElementName.
   */
  private computeLoopBoundaries(): void {
    const loopNodes = Array.from(this.nodeMap.values()).filter(n => n.subtype === "loops");
    for (const loopNode of loopNodes) {
      // Find loop end (noMoreValuesConnector)
      const loopEnd = (loopNode.element as any)?.noMoreValuesConnector?.targetReference ?? loopNode.name;
      // Use Compiler to find all elements between loop start and end
      const compiler = new Compiler();
      compiler.traverseFlow(loopNode.name, (element) => {
        this.elementsInLoop.set(element.name, loopNode.name);
      }, this.nodeMap, this.allConnectors, loopEnd); // Pass endElementName to stop at loop boundary
    }
  }

  // ========== PUBLIC QUERY API ==========
  public isReachable(elementName: string): boolean {
    return this.reachableFromStart.has(elementName);
  }

  public getReachableElements(): Set<string> {
    return new Set(this.reachableFromStart);
  }

  public isInLoop(elementName: string): boolean {
    return this.elementsInLoop.has(elementName);
  }

  public getContainingLoop(elementName: string): string | undefined {
    return this.elementsInLoop.get(elementName);
  }

  public getLoopElements(loopName: string): Set<string> {
    const result = new Set<string>();
    for (const [element, loop] of this.elementsInLoop) {
      if (loop === loopName) {
        result.add(element);
      }
    }
    return result;
  }

  public hasFaultConnector(elementName: string): boolean {
    const faults = this.faultConnectors.get(elementName);
    return faults ? faults.size > 0 : false;
  }

  public getFaultTargets(elementName: string): string[] {
    return Array.from(this.faultConnectors.get(elementName) || []);
  }

  public getNextElements(elementName: string): string[] {
    return Array.from(this.normalConnectors.get(elementName) || []);
  }

  public getAllNextElements(elementName: string): string[] {
    return Array.from(this.allConnectors.get(elementName) || []);
  }

  public getPreviousElements(elementName: string): string[] {
    return Array.from(this.reverseConnectors.get(elementName) || []);
  }

  public getNode(elementName: string): FlowNode | undefined {
    return this.nodeMap.get(elementName);
  }

  public isPartOfFaultHandling(elementName: string): boolean {
    const previous = this.getPreviousElements(elementName);
    return previous.some(prev => {
      const faultTargets = this.faultConnectors.get(prev);
      return faultTargets?.has(elementName) ?? false;
    });
  }

  public getLoopNodes(): FlowNode[] {
    return Array.from(this.nodeMap.values()).filter(n => n.subtype === "loops");
  }

  public forEachReachable(callback: (node: FlowNode) => void): void {
    for (const elementName of this.reachableFromStart) {
      const node = this.nodeMap.get(elementName);
      if (node) {
        callback(node);
      }
    }
  }

  
  /**
   * Export the graph to Mermaid flowchart syntax with rich documentation.
   */
  public toMermaid(options: {
    includeDetails?: boolean;
    includeMarkdownDocs?: boolean;
    collapsedDetails?: boolean;
    flowMetadata?: any;
  } = {}): string {
    let output = "";
    
    const diagram = this.generateMermaidDiagram(options);
    
    if (options.includeMarkdownDocs) {
      output = this.generateFullMarkdownDoc(diagram, options);
    } else {
      output = `\`\`\`mermaid\n${diagram}\n\`\`\``;
    }
    
    return output;
  }

  private generateMermaidDiagram(options: any): string {
    let mermaid = 'flowchart TB\n';
    
    // START node with flow metadata
    mermaid += this.generateStartNode(options.flowMetadata) + '\n\n';
    
    // Define nodes using FlowNode helper methods
    for (const [name, node] of this.nodeMap) {
      const icon = node.getIcon();
      const typeLabel = node.getTypeLabel();
      const summary = options.includeDetails ? node.getSummary() : '';
      
      let label = `${icon} <em>${typeLabel}</em><br/>${node.label || node.name}`;
      if (summary) {
        label += `<br/><small>${summary}</small>`;
      }
      
      const shape = this.getNodeShape(node.subtype);
      mermaid += `  ${name}${shape[0]}"${label}"${shape[1]}:::${node.subtype}\n`;
    }
    
    mermaid += '\n';
    mermaid += this.generateEdges() + '\n';
    mermaid += this.generateLoopSubgraphs() + '\n';
    mermaid += this.generateMermaidStyles();
    
    return mermaid;
  }

  private generateStartNode(flowMetadata?: any): string {
    if (!flowMetadata) {
      return 'START(["\uD83D\uDE80 <b>START</b>"]):::startClass';
    }
    
    let label = '\uD83D\uDE80 <b>START</b>'; // ROCKET
    
    if (flowMetadata.processType === 'Flow') {
      label += '<br/><b>Screen Flow</b>';
    } else if (flowMetadata.processType === 'AutoLaunchedFlow') {
      label += '<br/><b>AutoLaunched Flow</b>';
      if (flowMetadata.triggerType) {
        label += `<br/>Type: <b>${this.prettifyValue(flowMetadata.triggerType)}</b>`;
      }
    } else if (flowMetadata.object) {
      label += `<br/><b>${flowMetadata.object}</b>`;
      if (flowMetadata.triggerType) {
        label += `<br/>Type: <b>${this.prettifyValue(flowMetadata.triggerType)}</b>`;
      }
    }
    
    if (flowMetadata.status) {
      const statusIcon = flowMetadata.status === 'Active' ? '✅' : '⚠️';
      label += `<br/>${statusIcon} ${flowMetadata.status}`;
    }
    
    return `START(["${label}"]):::startClass`;
  }

  private getNodeShape(subtype: string): [string, string] {
    const shapeMap: Record<string, [string, string]> = {
      decisions: ['{', '}'],
      loops: ['{{', '}}'],
      collectionProcessors: ['{{', '}}'],
      transforms: ['{{', '}}'],
      screens: ['([', '])'],
      recordCreates: ['[(', ')]'],
      recordDeletes: ['[(', ')]'],
      recordLookups: ['[(', ')]'],
      recordUpdates: ['[(', ')]'],
      subflows: ['[[', ']]'],
      assignments: ['[\\', '/]'],
      default: ['(', ')']
    };
    
    return shapeMap[subtype] || shapeMap.default;
  }

  private generateEdges(): string {
    let edges = '';
    
    // Normal connectors
    for (const [from, targets] of this.allConnectors) {
      for (const to of targets) {
        edges += `  ${from} --> ${to}\n`;
      }
    }
    
    // Fault connectors (dashed)
    for (const [from, faults] of this.faultConnectors) {
      for (const to of faults) {
        edges += `  ${from} -. Fault .-> ${to}\n`;
      }
    }
    
    // Add END nodes
    const endNodes = this.findEndNodes();
    for (const endNode of endNodes) {
      edges += `  ${endNode}(( END )):::endClass\n`;
    }
    
    return edges;
  }

  private findEndNodes(): Set<string> {
    const endNodes = new Set<string>();
    
    for (const [from, targets] of this.allConnectors) {
      for (const to of targets) {
        // If target doesn't exist in nodeMap, it's an END
        if (!this.nodeMap.has(to)) {
          endNodes.add(to);
        }
      }
    }
    
    return endNodes;
  }

  private generateLoopSubgraphs(): string {
    let subgraphs = '';
    
    for (const loopNode of this.getLoopNodes()) {
      const loopElems = this.getLoopElements(loopNode.name);
      if (loopElems.size > 0) {
        subgraphs += `  subgraph "${loopNode.label || loopNode.name} Loop"\n`;
        for (const elem of loopElems) {
          subgraphs += `    ${elem}\n`;
        }
        subgraphs += '  end\n';
      }
    }
    
    return subgraphs;
  }

  private generateMermaidStyles(): string {
    const styles = {
      actionCalls: { fill: '#D4E4FC', color: 'black' },
      assignments: { fill: '#FBEED7', color: 'black' },
      collectionProcessors: { fill: '#F0E3FA', color: 'black' },
      customErrors: { fill: '#FFE9E9', color: 'black' },
      decisions: { fill: '#FDEAF6', color: 'black' },
      loops: { fill: '#FDEAF6', color: 'black' },
      recordCreates: { fill: '#FFF8C9', color: 'black' },
      recordDeletes: { fill: '#FFF8C9', color: 'black' },
      recordLookups: { fill: '#EDEAFF', color: 'black' },
      recordUpdates: { fill: '#FFF8C9', color: 'black' },
      screens: { fill: '#DFF6FF', color: 'black' },
      subflows: { fill: '#D4E4FC', color: 'black' },
      transforms: { fill: '#FDEAF6', color: 'black' },
      startClass: { fill: '#D9F2E6', color: 'black' },
      endClass: { fill: '#F9BABA', color: 'black' },
    };
    
    let styleStr = '';
    for (const [className, style] of Object.entries(styles)) {
      styleStr += `  classDef ${className} fill:${style.fill},color:${style.color},stroke:#333,stroke-width:2px\n`;
    }
    
    return styleStr;
  }

  private generateNodeDetailsMarkdown(collapsed: boolean): string {
    let md = '## Flow Nodes Details\n\n';
    
    if (collapsed) {
      md += '<details><summary>NODE DETAILS (expand to view)</summary>\n\n';
    }
    
    for (const [name, node] of this.nodeMap) {
      md += `### ${name}\n\n`;
      md += this.nodeToMarkdownTable(node);
      md += '\n';
    }
    
    if (collapsed) {
      md += '</details>\n\n';
    }
    
    return md;
  }

  private nodeToMarkdownTable(node: FlowNode): string {
    let table = '| Property | Value |\n|:---|:---|\n';
    
    // Use typed properties from FlowNode
    if (node.label) table += `| Label | ${node.label} |\n`;
    table += `| Type | ${node.getTypeLabel()} |\n`;
    
    // Type-specific properties (now type-safe!)
    if (node.actionType) table += `| Action Type | ${this.prettifyValue(node.actionType)} |\n`;
    if (node.actionName) table += `| Action Name | ${node.actionName} |\n`;
    if (node.object) table += `| Object | ${node.object} |\n`;
    if (node.flowName) table += `| Subflow | ${node.flowName} |\n`;
    if (node.collectionReference) table += `| Collection | ${node.collectionReference} |\n`;
    if (node.elementSubtype) table += `| Subtype | ${this.prettifyValue(node.elementSubtype)} |\n`;
    
    // Decision rules
    if (node.rules && node.rules.length > 0) {
      table += `| Rules | ${node.rules.length} |\n`;
      for (const rule of node.rules) {
        const conditions = Array.isArray(rule.conditions) ? rule.conditions : 
                          rule.conditions ? [rule.conditions] : [];
        table += `| ↳ ${rule.label || rule.name} | ${conditions.length} condition(s) |\n`;
      }
    }
    
    // Screen fields
    if (node.fields && node.fields.length > 0) {
      table += `| Fields | ${node.fields.length} |\n`;
    }
    
    if (node.description) table += `| Description | ${node.description} |\n`;
    if (node.faultConnector) table += `| Has Fault Handler | ✅ |\n`;
    
    return table;
  }

  private prettifyValue(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Generate full markdown documentation with diagram and node details
   */
  private generateFullMarkdownDoc(diagram: string, options: any): string {
    let md = '';
    
    // Header with flow metadata would come from Flow class
    md += '## Flow Diagram\n\n';
    md += '```mermaid\n';
    md += diagram;
    md += '\n```\n\n';
    
    // Node details section
    if (options.includeDetails) {
      md += this.generateNodeDetailsMarkdown(options.collapsedDetails);
    }
    
    return md;
  }

  /**
   * Export the graph to PlantUML syntax for UML-style diagrams.
   * @returns PlantUML string.
   */
  public toPlantUML(): string {
    let plantuml = '@startuml\nskinparam activityBackgroundColor #D4E4FC\n';  // Basic styling
    
    // Nodes
    for (const [name, node] of this.nodeMap) {
      plantuml += `activity "${node.subtype}: ${name}" as ${name}\n`;
    }
    
    // Edges
    for (const [from, targets] of this.allConnectors) {
      for (const to of targets) {
        plantuml += `${from} --> ${to}\n`;
      }
    }
    
    // Loops as groups
    for (const loopNode of this.getLoopNodes()) {
      plantuml += `partition "${loopNode.name} Loop" {\n`;
      const loopElems = this.getLoopElements(loopNode.name);
      for (const elem of loopElems) {
        plantuml += `  ${elem}\n`;
      }
      plantuml += '}\n';
    }
    
    plantuml += '@enduml';
    return plantuml;
  }
}