import {FlowNode} from './FlowNode';
import { FlowMetadata } from './FlowMetadata';
import {FlowElement} from './FlowElement';
import {FlowVariable} from './FlowVariable';
import p from "path-browserify";
import { FlowResource } from './FlowResource';

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

  private flowVariables = [
    'choices',
    'constants',
    'dynamicChoiceSets',
    'formulas',
    'variables'
  ];
  private flowResources = ['textTemplates', 'stages'];
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

  constructor(args :{path: string, xmldata: any}) {
    this.fsPath = p.resolve(args.path);
    let flowName = p.basename(p.basename(this.fsPath), p.extname(this.fsPath));
    if (flowName.includes('.')) {
      flowName = flowName.split('.')[0]
    }
    this.name = flowName;
    if(args.xmldata && args.xmldata.Flow){
      this.xmldata = args.xmldata.Flow;
    } else if(args.xmldata){
      this.xmldata = args.xmldata;
    }
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
      } else if (this.flowResources.includes(nodeType)) {
        for (const node of nodesOfType) {
          allNodes.push(
            new FlowResource(node.name, nodeType, node)
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

