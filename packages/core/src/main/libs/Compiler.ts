import { FlowNode } from "../models/FlowNode";

export class Compiler {
  public visitedElements: Set<string>;
  constructor() {
    this.visitedElements = new Set<string>();
  }
  traverseFlow(
    startElementName: string,
    visitCallback: (element: FlowNode) => void,
    nodeMap: Map<string, FlowNode>,
    allConnectors: Map<string, Set<string>>,
    endElementName?: string
  ) {
    // Iterative Deepening Depth-First Search (IDDFS)
    let elementsToVisit = [startElementName];
    while (elementsToVisit.length > 0) {
      const nextElements: string[] = [];
      for (const elementName of elementsToVisit) {
        if (!this.visitedElements.has(elementName)) {
          const currentElement = nodeMap.get(elementName);
          if (currentElement) {
            visitCallback(currentElement);
            this.visitedElements.add(elementName);
            nextElements.push(...this.findNextElements(elementName, allConnectors, nodeMap, endElementName));
          }
        }
      }
      if (nextElements.length === 0) {
        // If no more next elements
        break; // Terminate the traversal
      }
      elementsToVisit = nextElements;
    }
  }
  private findNextElements(
    elementName: string,
    allConnectors: Map<string, Set<string>>,
    nodeMap: Map<string, FlowNode>,
    endElementName?: string
  ): string[] {
    const nextElements: string[] = [];
    const targets = allConnectors.get(elementName);
    if (targets) {
      for (const targetReference of targets) {
        if (targetReference !== endElementName && nodeMap.has(targetReference)) { // Safety check for existence
          nextElements.push(targetReference);
        }
      }
    }
    return nextElements;
  }
}