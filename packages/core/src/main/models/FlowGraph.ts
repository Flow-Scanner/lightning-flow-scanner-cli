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

  constructor(nodes: FlowNode[], startReference?: string) {
    this.buildNodeMaps(nodes);
    this.buildConnectorMaps(nodes);
    this.computeLoopBoundaries();
    if (startReference) {
      this.computeReachability(startReference);
    }
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
}