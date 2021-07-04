import {FlowElement} from './FlowElement';
import {FlowMetadata} from './FlowMetadata';
import {FlowNode} from './FlowNode';
import {FlowVariable} from './FlowVariable';
import {RuleResult} from './RuleResult';

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
  public resultCount?;
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
    this.preProcessNodes(args.xmldata);

  }

  private preProcessNodes(xml) {
    const mergeableVariables = ['variables', 'choices', 'constants', 'dynamicChoiceSets', 'formulas', 'stages', 'textTemplates'];
    const flowMetadata = ['$',
      'description',
      'apiVersion',
      'processMetadataValues',
      'processType',
      'interviewLabel',
      'label',
      'status'
    ];

    const allNodes: (FlowVariable | FlowElement | FlowMetadata)[] = [];
    const flowXML = xml.Flow;
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
      } else if (mergeableVariables.includes(nodeType)) {
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

    this.label = xml.Flow.label;
    this.interviewLabel = xml.Flow.interviewLabel;
    this.processType = xml.Flow.processType;
    this.processMetadataValues = xml.Flow.processMetadataValues;
    this.start = xml.Flow.start;
    this.status = xml.Flow.status;

    let type;
    if (xml.Flow.start[0].triggerType) {
      type = 'Trigger:' + xml.Flow.start[0].triggerType;
    } else {
      type = xml.Flow.processType[0] === 'Flow' ? 'Visual Flow' : xml.Flow.processType;
    }
    this.type = type;
    this.nodes = allNodes;
  }

}
