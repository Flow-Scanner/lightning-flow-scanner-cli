import { FlowNode } from "./FlowNode";
import { FlowMetadata } from "./FlowMetadata";
import { FlowElement } from "./FlowElement";
import { FlowVariable } from "./FlowVariable";
import * as p from "path-browserify";
import { FlowResource } from "./FlowResource";
import { XMLSerializedAsObject } from "xmlbuilder2/lib/interfaces";
import { create } from "xmlbuilder2";

export class Flow {
  public label: string;
  public xmldata;
  public name?: string;
  public interviewLabel?: string;
  public processType?;
  public processMetadataValues?;
  public type?;
  public start?;
  public startElementReference?;
  public status?;
  public fsPath;
  public root?;
  public elements?: FlowElement[];
  public startReference;
  public triggerOrder?: number;

  private flowVariables = ["choices", "constants", "dynamicChoiceSets", "formulas", "variables"];
  private flowResources = ["textTemplates", "stages"];
  private flowMetadata = [
    "description",
    "apiVersion",
    "processMetadataValues",
    "processType",
    "interviewLabel",
    "label",
    "status",
    "runInMode",
    "startElementReference",
    "isTemplate",
    "fullName",
    "timeZoneSidKey",
    "isAdditionalPermissionRequiredToRun",
    "migratedFromWorkflowRuleName",
    "triggerOrder",
    "environments",
    "segment",
  ];
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
  ];

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
      const hasFlowElement = !!data && typeof data === "object" && "Flow" in data;
      if (hasFlowElement) {
        this.xmldata = (data as XMLSerializedAsObject).Flow;
      } else this.xmldata = data;
      this.preProcessNodes();
    }
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
    const allNodes: (FlowVariable | FlowNode | FlowMetadata)[] = [];
    for (const nodeType in this.xmldata) {
      // skip xmlns url
      // if (nodeType == "@xmlns") {
      //   continue;
      // }
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

  private findStart() {
    let start = "";
    const flowElements: FlowNode[] = this.elements.filter(
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
      start = startElement.connectors[0]["reference"];
    }
    return start;
  }

  public toXMLString(): string {
    try {
      return this.generateDoc();
    } catch (exception) {
      console.warn(`Unable to write xml, caught an error ${exception.toString()}`);
      return "";
    }
  }

  private generateDoc(): string {
    const flowXmlNamespace = "http://soap.sforce.com/2006/04/metadata";
    const doc = create(
      {
        encoding: "UTF-8",
      },
      { Flow: this.xmldata }
    )
      .root()
      .att("xmlns", flowXmlNamespace);
    return doc.end({ prettyPrint: true });
  }
}
