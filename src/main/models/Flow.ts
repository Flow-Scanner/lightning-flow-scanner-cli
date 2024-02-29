import { FlowNode } from './FlowNode';
import { FlowMetadata } from './FlowMetadata';
import { FlowElement } from './FlowElement';
import { FlowVariable } from './FlowVariable';
import * as p from 'path';

export default class Flow {

  public label: string;
  public xmldata;
  public name?: string;
  public path?: string;
  public interviewLabel?: string;
  public processType?;
  public processMetadataValues?;
  public type?;
  public start?;
  public startElementReference?;
  public status?;
  public uri?;
  public root?;
  public elements?: FlowElement[];
  public startReference;

  private flowVariables = [
    'choices',
    'constants',
    'dynamicChoiceSets',
    'formulas',
    'variables'
  ];
  private flowMetadata = [
    'description',
    'apiVersion',
    'processMetadataValues',
    'processType',
    'interviewLabel',
    'label',
    'status',
    'stages',
    'textTemplates',
    'runInMode',
    'startElementReference',
    'isTemplate',
    'fullName',
    'timeZoneSidKey',
    'isAdditionalPermissionRequiredToRun',
    'migratedFromWorkflowRuleName',
    'triggerOrder',
    'Environments',
    'segment'
  ];
  private flowNodes = [
    'actionCalls',
    'apexPluginCalls',
    'assignments',
    'collectionProcessors',
    'decisions',
    'loops',
    'orchestratedStages',
    'recordCreates',
    'recordDeletes',
    'recordLookups',
    'recordUpdates',
    'recordRollbacks',
    'screens',
    'start',
    'steps',
    'subflows',
    'waits'
  ];

  constructor(args) {
    this.uri = args.uri;
    if (args.uri) {
      this.path = args.uri.fsPath;
    }
    if (args.path) {
      this.path = args.path;
    }
    let flowName = p.basename(p.basename(this.path), p.extname(this.path));
    if (flowName.includes('.')) {
      flowName = flowName.split('.')[0]
    }
    this.name = flowName;
    this.xmldata = args.xmldata.Flow;
    this.preProcessNodes();
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
    const allNodes: (FlowVariable | FlowNode | FlowMetadata)[] = [];
    for (const nodeType in this.xmldata) {
      const nodesOfType = this.xmldata[nodeType];
      // skip xmlns url
      if (nodeType == '$') {
        this.root = nodesOfType;
        continue;
      }
      if (this.flowMetadata.includes(nodeType)) {
        for (const node of nodesOfType) {
          allNodes.push(new FlowMetadata(
            nodeType,
            node
          ));
        }
      } else if (this.flowVariables.includes(nodeType)) {
        for (const node of nodesOfType) {
          allNodes.push(
            new FlowVariable(node.name, nodeType, node)
          );
        }
      } else if (this.flowNodes.includes(nodeType)) {
        for (const node of nodesOfType) {
          allNodes.push(
            new FlowNode(node.name, nodeType, node)
          );
        }
      }
    }
    this.elements = allNodes;
    this.startReference = this.findStart();
  }

  private findStart() {
    let start = '';
    const flowElements: FlowNode[] = this.elements.filter(node => node instanceof FlowNode) as FlowNode[];
    if (this.startElementReference) {
      start = this.startElementReference[0];
    } else if(flowElements.find(n => {
      return n.subtype === 'start';
    })){
      let startElement = flowElements.find(n => {
        return n.subtype === 'start';
      });
      start = startElement.connectors[0].reference;
    }
    return start;
  }

}

