import Flow from '../models/Flow';
import FlowNode from '../models/FlowNode';

export class Compiler {
    private visitedElements: Set<string>;

    constructor() {
        this.visitedElements = new Set<string>();
    }

    isInLoop = (flow: Flow, element: FlowNode, startOfLoop: FlowNode): boolean => {
        const connectors = element.connectors || [];
        for (const connector of connectors) {
          if (connector.reference) {
            const referencedElement = (flow.elements as FlowNode[]).find(el => el.name === connector.reference);
            if (referencedElement === startOfLoop) {
              return true;
            }
            if (this.isInLoop(flow, referencedElement, startOfLoop)) {
              return true;
            }
          }
        }
        return false;
      };

    traverseFlow(flow: Flow, startElementName: string, visitCallback: (element: FlowNode) => void) {
        // Iterative Deepening Depth-First Search (IDDFS)
        // let depth = 0;
        let elementsToVisit = [startElementName];

        while (elementsToVisit.length > 0) {
            const nextElements = [];
            
            for (const elementName of elementsToVisit) {
                if (!this.visitedElements.has(elementName)) {
                    const currentElement = flow.elements.find(element => element instanceof FlowNode && element.name === elementName) as FlowNode;
                    if (currentElement) {
                        visitCallback(currentElement);
                        this.visitedElements.add(elementName);
                        nextElements.push(...this.findNextElements(flow, currentElement));
                    }
                }
            }
            
            elementsToVisit = nextElements;
            // add logic to control depth or terminate the traversal based on requirements.
            // depth++;
        }
    }

    private findNextElements(flow: Flow, currentElement: FlowNode): string[] {
        const nextElements: string[] = [];
    
        if (currentElement.connectors && currentElement.connectors.length > 0) {
            for (const connector of currentElement.connectors) {
                if (connector.reference) {
                    // Check if the reference exists in the flow elements
                    const nextElement = flow.elements.find(
                        element => element instanceof FlowNode && element.name === connector.reference
                    );
                    if (nextElement instanceof FlowNode) {
                        nextElements.push(nextElement.name);
                    }
                }
            }
        }
    
        return nextElements;
    }
}
