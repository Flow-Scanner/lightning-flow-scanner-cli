/**
 * Adapter functions to convert between core models (Flow, Violation)
 * and regex-scanner models (MetadataFile, RegexViolation).
 *
 * This allows core rules to delegate to regex-scanner while maintaining
 * backward compatibility with existing consumers.
 */

import type {
  MetadataFile,
  MetadataElement,
  RegexViolation,
} from "@flow-scanner/regex-scanner";

import { Flow } from "../models/Flow";
import { FlowAttribute } from "../models/FlowAttribute";
import { FlowElement } from "../models/FlowElement";
import { Violation } from "../models/Violation";
import { MetaType } from "../enums/MetadataTypes";

/**
 * Convert a Flow object to a MetadataFile for regex-scanner.
 */
export function toMetadataFile(flow: Flow): MetadataFile {
  // Handle case where toXMLString may not exist (e.g., in tests with partial Flow objects)
  let content = "";
  if (typeof flow.toXMLString === "function") {
    content = flow.toXMLString();
  }

  return {
    name: flow.name,
    fileName: flow.uri
      ? flow.uri.split(/[\\/]/).pop() ?? `${flow.name}.flow-meta.xml`
      : `${flow.name}.flow-meta.xml`,
    filePath: flow.fsPath,
    metadataType: "Flow",
    content,
    elements: toMetadataElements(flow),
  };
}

/**
 * Convert Flow elements to MetadataElements for element-level scanning.
 */
export function toMetadataElements(flow: Flow): MetadataElement[] {
  if (!flow.elements || flow.elements.length === 0) {
    return [];
  }

  return flow.elements.map((element) => ({
    name: element.name,
    type: element.subtype,
    content: element.element ?? element,
  }));
}

/**
 * Convert a RegexViolation to a core Violation.
 * Creates the appropriate FlowElement subclass based on metaType.
 */
export function toViolation(rv: RegexViolation): Violation {
  // Create a FlowAttribute to represent the violation
  // This is the simplest approach that works for all regex rules
  const flowElement = new FlowAttribute(
    rv.name,
    rv.type,
    rv.expression ?? rv.matchedText
  );

  const violation = new Violation(flowElement);

  // Override line/column from regex violation
  violation.lineNumber = rv.lineNumber;
  violation.columnNumber = rv.columnNumber;

  return violation;
}

/**
 * Convert a core FlowElement to a regex-scanner MetadataElement.
 */
export function flowElementToMetadataElement(
  element: FlowElement
): MetadataElement {
  return {
    name: element.name,
    type: element.subtype,
    content: element.element ?? element,
  };
}

/**
 * Convert multiple RegexViolations to core Violations.
 */
export function toViolations(violations: RegexViolation[]): Violation[] {
  return violations.map(toViolation);
}
