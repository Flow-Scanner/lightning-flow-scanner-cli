import { Flow } from "./Flow";
import { FlowAttribute } from "./FlowAttribute";
import { FlowElement } from "./FlowElement";
import { FlowNode } from "./FlowNode";
import { FlowVariable } from "./FlowVariable";

export class Violation {
  public columnNumber?: number;
  public details: object;
  public lineNumber?: number;
  public metaType: string;
  public name: string;
  public type: string;
  public violation: FlowAttribute | FlowElement;
  
  constructor(violation: FlowAttribute | FlowElement) {
    this.violation = violation;
    this.name = violation.name as string;
    this.metaType = violation.metaType;
    this.type = violation.subtype;
    
    if (violation.metaType === "variable") {
      const element = violation as FlowVariable;
      this.details = { dataType: element.dataType };
    }
    if (violation.metaType === "node") {
      const element = violation as FlowNode;
      this.details = {
        connectsTo: element.connectors?.map((connector) => connector.reference),
        locationX: element.locationX,
        locationY: element.locationY,
      };
    }
    if (violation.metaType === "attribute") {
      const element = violation as FlowAttribute;
      this.details = { expression: element.expression };
    }
  }
}

export function enrichViolationsWithLineNumbers(
  violations: Violation[],
  flowXml: string
): void {
  if (!flowXml || violations.length === 0) return;
  const lines = flowXml.split("\n");
  
  // Flow-level XML tags (same as Flow.flowMetadata)
  const flowLevelTags = Flow.FLOW_METADATA_TAGS;
  
  for (const violation of violations) {
    let found = false;
    
    // For flow elements (nodes, variables, resources), search by <name> tag
    if (violation.metaType !== 'attribute') {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`<name>${violation.name}</name>`)) {
          violation.lineNumber = i + 1;
          violation.columnNumber = lines[i].indexOf(violation.name) + 1;
          found = true;
          break;
        }
      }
    }
    
    // For flow-level attributes, search by the XML tag if it exists
    if (!found && violation.metaType === 'attribute') {
      const tagName = violation.type;
      
      // Only search if it's an actual XML tag
      if (flowLevelTags.includes(tagName)) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(`<${tagName}>`)) {
            violation.lineNumber = i + 1;
            violation.columnNumber = lines[i].indexOf(`<${tagName}>`) + 1;
            found = true;
            break;
          }
        }
      }
      
      // For synthetic metrics or if tag not found, default to line 1
      if (!found) {
        violation.lineNumber = 1;
        violation.columnNumber = 1;
      }
    }
  }
}