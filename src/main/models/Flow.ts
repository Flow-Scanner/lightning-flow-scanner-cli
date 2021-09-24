import {FlowElement} from './FlowElement';
import {FlowMetadata} from './FlowMetadata';
import {FlowNode} from './FlowNode';
import {FlowVariable} from './FlowVariable';
import {RuleResult} from './RuleResult';
import createLogger from "logging";

export class Flow {

  public label: string;
  public xmldata;
  public path?: string;

  public interviewLabel?: string;
  public processType?;
  public processMetadataValues?;
  public type?;
  public start?;
  public status?;
  public uri?;
  public root?;
  public scanResults?: RuleResult[] = [];

  public processedData?;
  public nodes?: FlowNode[];

  constructor(args) {
    this.interviewLabel = args.interviewLabel;
    this.label = args.label;
    this.processMetadataValues = args.processMetadataValues;
    this.processType = args.processType;
    this.start = args.start;
    this.status = args.status;
    this.uri = args.uri;
    if (args.uri) {
      this.path = args.uri.fsPath;
    }
    if (args.path) {
      this.path = args.path;
    }
    this.xmldata = args.xmldata;
    this.preProcessNodes();

  }

  public preProcessNodes() {

    const flowVariables = ['variables', 'choices', 'constants', 'dynamicChoiceSets', 'formulas', 'stages', 'textTemplates'];
    const flowMetadata = ['$',
      'description',
      'apiVersion',
      'processMetadataValues',
      'processType',
      'interviewLabel',
      'label',
      'status',
      'runInMode'
    ];

    const allNodes: (FlowVariable | FlowElement | FlowMetadata)[] = [];
    const flowXML = this.xmldata.Flow;
    for (const nodeType in flowXML) {
      const nodesOfType = flowXML[nodeType];
      // skip xmlns url
      if (nodeType == '$') {
        this.root = nodesOfType;
        continue;
      }
      if (flowMetadata.includes(nodeType)) {
        for (const node of nodesOfType) {
          allNodes.push(new FlowMetadata(
            nodeType,
            node
          ));
        }
      } else if (flowVariables.includes(nodeType)) {
        for (const node of nodesOfType) {
          allNodes.push(
            new FlowVariable(node.name, nodeType, node)
          );
        }
      } else {
        for (const node of nodesOfType) {
          allNodes.push(
            new FlowElement(node.name, nodeType, node)
          );
        }
      }
    }

    this.label = this.xmldata.Flow.label;
    this.interviewLabel = this.xmldata.Flow.interviewLabel;
    this.processType = this.xmldata.Flow.processType;
    this.processMetadataValues = this.xmldata.Flow.processMetadataValues;
    this.start = this.xmldata.Flow.start;
    this.status = this.xmldata.Flow.status;

    let type;
    if (this.xmldata.Flow.start[0].triggerType) {
      type = 'Trigger:' + this.xmldata.Flow.start[0].triggerType;
    } else {
      type = this.xmldata.Flow.processType[0] === 'Flow' ? 'Visual Flow' : this.xmldata.Flow.processType;
    }
    this.type = type;
    this.nodes = allNodes;
  }

}
