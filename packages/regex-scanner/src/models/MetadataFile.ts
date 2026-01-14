/**
 * Represents a generic Salesforce metadata file that can be scanned by regex rules.
 * This abstraction allows the same rules to work on Flows, Apex, Custom Objects, etc.
 */
export interface MetadataFile {
  /** Metadata name without extension, e.g., "My_Flow", "AccountTrigger" */
  name: string;

  /** File name with extension, e.g., "My_Flow.flow-meta.xml" */
  fileName: string;

  /** Absolute file path if available */
  filePath?: string;

  /** Salesforce metadata type, e.g., "Flow", "ApexClass", "CustomObject" */
  metadataType: string;

  /** Raw file content (XML, Apex code, JSON, etc.) */
  content: string;

  /** Optional: pre-parsed elements for element-level rules */
  elements?: MetadataElement[];
}

/**
 * Represents a discrete element within a metadata file that can be individually scanned.
 * For Flows, these are actionCalls, decisions, variables, etc.
 */
export interface MetadataElement {
  /** Element name/identifier */
  name: string;

  /** Element type, e.g., "actionCalls", "variables", "decisions" */
  type: string;

  /** Serializable content for regex search (will be JSON.stringify'd) */
  content: string | object;
}
