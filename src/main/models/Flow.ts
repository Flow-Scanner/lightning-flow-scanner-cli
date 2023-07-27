import {FlowElement} from './FlowElement';
import {FlowMetadata} from './FlowMetadata';
import {FlowNode} from './FlowNode';
import {FlowVariable} from './FlowVariable';
import p from 'path';

export class Flow {

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
  public nodes?: FlowNode[];

  private flowVariables = [
    'choices',
    'constants',
    'dynamicChoiceSets',
    'formulas',
    'stages',
    'textTemplates',
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
    'runInMode',
    'startElementReference',
    'isTemplate',
    'fullName'
  ];
  private flowNodes = [
    'actionCalls',
    'apexPluginCalls',
    'assignments',
    'collectionProcessors',
    'decisions',
    'loops',
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
    if(flowName.includes('.')){
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
    this.status = this.xmldata.status;
    this.start = this.xmldata.start;
    this.type = this.xmldata.processType;
    const allNodes: (FlowVariable | FlowElement | FlowMetadata)[] = [];
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
              new FlowElement(node.name, nodeType, node)
            );
        }
      }
    }
    this.nodes = allNodes;
  }

}
