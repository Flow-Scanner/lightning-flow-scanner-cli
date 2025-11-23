import { XMLBuilder } from "fast-xml-parser";
import * as p from "path";

import { FlowElement } from "./FlowElement";
import { FlowMetadata } from "./FlowMetadata";
import { FlowNode } from "./FlowNode";
import { FlowResource } from "./FlowResource";
import { FlowVariable } from "./FlowVariable";

export class Flow {
    /**
   * Metadata Tags of Salesforce Flow Elements
   */
  public static readonly FLOW_METADATA_TAGS = [
    "description", "apiVersion", "processMetadataValues", "processType",
    "interviewLabel", "label", "status", "runInMode", "startElementReference",
    "isTemplate", "fullName", "timeZoneSidKey", 
    "isAdditionalPermissionRequiredToRun", "migratedFromWorkflowRuleName",
    "triggerOrder", "environments", "segment",
  ];

  /**
   * Categorized flow contents that should be used in the rule implementation
   */
  public elements?: FlowElement[];
  public fsPath;
  public interviewLabel?: string;
  public label: string;
  public name?: string;
  public processMetadataValues?;
  public processType?;
  public root?;
  public start?;
  public startElementReference?;
  public startReference;
  public status?;
  public triggerOrder?: number;
  public type?;

  /**
   * XML to JSON conversion in raw format
   */
  public xmldata;
  private flowMetadata = Flow.FLOW_METADATA_TAGS;
  private flowNodes = [
    "actionCalls",
    "apexPluginCalls",
    "assignments",
    "collectionProcessors",
    "decisions",
    "loops",
    "orchestratedStages",
    "recordCreates",
    "recordDeletes",
    "recordLookups",
    "recordUpdates",
    "recordRollbacks",
    "screens",
    "start",
    "steps",
    "subflows",
    "waits",
    "transforms",
    "customErrors",
  ];
  private flowResources = ["textTemplates", "stages"];
  private flowVariables = ["choices", "constants", "dynamicChoiceSets", "formulas", "variables"];

  constructor(path?: string, data?: unknown);
  constructor(path: string, data?: unknown) {
    if (path) {
      this.fsPath = p.resolve(path);
      let flowName = p.basename(p.basename(this.fsPath), p.extname(this.fsPath));
      if (flowName.includes(".")) {
        flowName = flowName.split(".")[0];
      }
      this.name = flowName;
    }
    if (data) {
      const hasFlowElement = typeof data === "object" && "Flow" in data;
      if (hasFlowElement) {
        this.xmldata = (data as any).Flow;
      } else this.xmldata = data;
      this.preProcessNodes();
    }
  }

  public static from(obj: Partial<Flow>): Flow {
    if (obj instanceof Flow) {
      return obj;
    }
    
    const flow = Object.create(Flow.prototype);
    Object.assign(flow, obj);
    
    if (!flow.toXMLString) {
      flow.toXMLString = () => '';
    }
    
    return flow;
  }

  public preProcessNodes() {
    this.label = this.xmldata.label;
    this.interviewLabel = this.xmldata.interviewLabel;
    this.processType = this.xmldata.processType;
    this.processMetadataValues = this.xmldata.processMetadataValues;
    this.startElementReference = this.xmldata.startElementReference;
    this.start = this.xmldata.start;
    this.status = this.xmldata.status;
    this.type = this.xmldata.processType;
    this.triggerOrder = this.xmldata.triggerOrder;

    const allNodes: Array<FlowMetadata | FlowNode | FlowVariable> = [];
    for (const nodeType in this.xmldata) {
      // Skip xmlns and attributes
      if (nodeType.startsWith("@_") || nodeType === "@xmlns") {
        continue;
      }
      const data = this.xmldata[nodeType];
      if (this.flowMetadata.includes(nodeType)) {
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowMetadata(nodeType, node));
          }
        } else {
          allNodes.push(new FlowMetadata(nodeType, data));
        }
      } else if (this.flowVariables.includes(nodeType)) {
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowVariable(node.name, nodeType, node));
          }
        } else {
          allNodes.push(new FlowVariable(data.name, nodeType, data));
        }
      } else if (this.flowNodes.includes(nodeType)) {
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowNode(node.name, nodeType, node));
          }
        } else {
          allNodes.push(new FlowNode(data.name, nodeType, data));
        }
      } else if (this.flowResources.includes(nodeType)) {
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowResource(node.name, nodeType, node));
          }
        } else {
          allNodes.push(new FlowResource(data.name, nodeType, data));
        }
      }
    }
    this.elements = allNodes;
    this.startReference = this.findStart();
  }

  public toXMLString(): string {
    try {
      return this.generateDoc();
    } catch (exception) {
      console.warn(`Unable to write xml, caught an error ${exception.toString()}`);
      return "";
    }
  }

  private findStart() {
    let start = "";
    const flowElements: FlowNode[] = this.elements!.filter(
      (node) => node instanceof FlowNode
    ) as FlowNode[];
    if (this.startElementReference) {
      start = this.startElementReference;
    } else if (
      flowElements.find((n) => {
        return n.subtype === "start";
      })
    ) {
      const startElement = flowElements.find((n) => {
        return n.subtype === "start";
      });
      start = startElement!.connectors[0]["reference"];
    }
    return start;
  }

  private generateDoc(): string {
    // eslint-disable-next-line sonarjs/no-clear-text-protocols
    const flowXmlNamespace = "http://soap.sforce.com/2006/04/metadata";
    const builderOptions = {
      attributeNamePrefix: "@_",             // Matches parsing (key prefix)
      format: true,                          // Pretty-print (indented; expands empties to </tag>)
      ignoreAttributes: false,               // Preserve attrs like xmlns
      suppressBooleanAttributes: false,       // NEW: Force ="true" for boolean-like strings (fixes missing value)
      suppressEmptyNode: false              // Keep empty tags (but doesn't force self-closing in pretty)
    };
    const builder = new XMLBuilder(builderOptions);

    // Fallback: Inject xmlns as attribute if missing
    const xmldataWithNs = { ...this.xmldata };
    if (!xmldataWithNs["@_xmlns"]) {
      xmldataWithNs["@_xmlns"] = flowXmlNamespace;
    }
    // Optional: Add xsi if needed (often in parsed data; test has it in root)
    if (!xmldataWithNs["@_xmlns:xsi"]) {
      xmldataWithNs["@_xmlns:xsi"] = "http://www.w3.org/2001/XMLSchema-instance";
    }

    // Build: Wrap in { Flow: ... }
    const rootObj = { Flow: xmldataWithNs };
    return builder.build(rootObj);
  }
}