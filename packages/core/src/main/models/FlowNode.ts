import { MetaType } from "../enums/MetadataTypes";
import { FlowElement } from "./FlowElement";
import { FlowElementConnector } from "./FlowElementConnector";
import { DEFAULT_ICONS, ASCII_ICONS, type NodeIconConfig } from "../config/NodeIcons";

export class FlowNode extends FlowElement {
  public connectors: FlowElementConnector[] = [];
  public locationX?: string;
  public locationY?: string;
  
  // Common properties across node types
  public label?: string;
  public description?: string;
  
  // Action-specific properties
  public actionType?: string;
  public actionName?: string;
  
  // Record operation properties
  public object?: string;
  public inputReference?: string;
  public outputReference?: string;
  
  // Collection processor properties
  public elementSubtype?: string;
  public collectionReference?: string;
  
  // Subflow properties
  public flowName?: string;
  
  // Decision properties
  public rules?: any[];
  public defaultConnectorLabel?: string;
  
  // Loop properties
  public iterationOrder?: string;
  
  // Screen properties
  public fields?: any[];
  public allowPause?: boolean;
  public showFooter?: boolean;
  
  // Fault handling
  public faultConnector?: FlowElementConnector;

  // Static icon configuration (can be overridden)
  private static iconConfig: NodeIconConfig = DEFAULT_ICONS;

  /**
   * Set custom icon configuration for all FlowNodes
   * @example
   * ```typescript
   * // Use ASCII icons for old terminals
   * FlowNode.setIconConfig(ASCII_ICONS);
   * 
   * // Or provide custom icons
   * FlowNode.setIconConfig({
   *   actionCalls: { default: '[ACTION]' },
   *   decisions: { default: '[IF]' }
   * });
   * ```
   */
  public static setIconConfig(config: NodeIconConfig): void {
    FlowNode.iconConfig = config;
  }

  /**
   * Use ASCII icons instead of emoji (for older browsers/terminals)
   */
  public static useAsciiIcons(): void {
    FlowNode.iconConfig = ASCII_ICONS;
  }

  /**
   * Reset to default emoji icons
   */
  public static useDefaultIcons(): void {
    FlowNode.iconConfig = DEFAULT_ICONS;
  }

  constructor(provName: string, subtype: string, element: object) {
    const nodeName = subtype === "start" ? "flowstart" : provName;
    super(MetaType.NODE, subtype, nodeName, element);
    
    // Extract common properties
    this.label = element["label"];
    this.description = element["description"];
    this.locationX = element["locationX"];
    this.locationY = element["locationY"];
    
    // Extract type-specific properties
    this.extractTypeSpecificProperties(subtype, element);
    
    // Extract connectors
    this.connectors = this.getConnectors(subtype, element);
    this.faultConnector = this.connectors.find(c => c.type === "faultConnector");
  }

  private extractTypeSpecificProperties(subtype: string, element: any): void {
    switch (subtype) {
      case "actionCalls":
        this.actionType = element.actionType;
        this.actionName = element.actionName;
        break;
        
      case "recordCreates":
      case "recordUpdates":
      case "recordDeletes":
      case "recordLookups":
        this.object = element.object;
        this.inputReference = element.inputReference;
        this.outputReference = element.outputReference;
        break;
        
      case "collectionProcessors":
        this.elementSubtype = element.elementSubtype;
        this.collectionReference = element.collectionReference;
        break;
        
      case "subflows":
        this.flowName = element.flowName;
        break;
        
      case "decisions":
        this.rules = Array.isArray(element.rules) ? element.rules : 
                     element.rules ? [element.rules] : [];
        this.defaultConnectorLabel = element.defaultConnectorLabel;
        break;
        
      case "loops":
        this.collectionReference = element.collectionReference;
        this.iterationOrder = element.iterationOrder;
        break;
        
      case "screens":
        this.fields = Array.isArray(element.fields) ? element.fields :
                      element.fields ? [element.fields] : [];
        this.allowPause = element.allowPause;
        this.showFooter = element.showFooter;
        break;
    }
  }

  /**
   * Get a human-readable summary of this node
   */
  public getSummary(): string {
    const parts: string[] = [];
    
    switch (this.subtype) {
      case "actionCalls":
        if (this.actionType) parts.push(this.prettifyValue(this.actionType));
        if (this.actionName) parts.push(this.actionName);
        break;
        
      case "recordCreates":
      case "recordUpdates":
      case "recordDeletes":
      case "recordLookups":
        if (this.object) parts.push(this.object);
        break;
        
      case "collectionProcessors":
        if (this.elementSubtype) parts.push(this.prettifyValue(this.elementSubtype));
        break;
        
      case "decisions":
        parts.push(`${this.rules?.length || 0} rule${this.rules?.length !== 1 ? 's' : ''}`);
        break;
        
      case "loops":
        if (this.collectionReference) parts.push(`Loop: ${this.collectionReference}`);
        break;
        
      case "subflows":
        if (this.flowName) parts.push(this.flowName);
        break;
    }
    
    if (this.description) {
      parts.push(this.description.substring(0, 50) + (this.description.length > 50 ? '...' : ''));
    }
    
    return parts.join(' • ');
  }

  /**
   * Get the icon for this node type
   */
  public getIcon(): string {
    const typeIcons = FlowNode.iconConfig[this.subtype];
    if (!typeIcons) {
      // Fallback for unknown types
      const fallback = FlowNode.iconConfig['default'];
      return (fallback && 'default' in fallback) ? fallback.default : '\u2022'; // • BULLET
    }
    
    // For nodes with subtypes (like actionCalls or collectionProcessors)
    const subtype = this.actionType || this.elementSubtype;
    const icons = typeIcons as Record<string, string>;
    
    if (subtype && icons[subtype]) {
      return icons[subtype];
    }
    
    return icons.default || '\u2022'; // • BULLET fallback
  }

  /**
   * Get the display name for this node type
   */
  public getTypeLabel(): string {
    const labelMap: Record<string, string> = {
      actionCalls: 'Action',
      assignments: 'Assignment',
      collectionProcessors: 'Collection',
      customErrors: 'Error',
      decisions: 'Decision',
      loops: 'Loop',
      recordCreates: 'Create',
      recordDeletes: 'Delete',
      recordLookups: 'Get Records',
      recordUpdates: 'Update',
      screens: 'Screen',
      subflows: 'Subflow',
      transforms: 'Transform',
    };
    
    return labelMap[this.subtype] || this.subtype;
  }

  private prettifyValue(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private getConnectors(subtype, element) {
    const connectors: FlowElementConnector[] = [];
    if (subtype === "start") {
      if (element.connector) {
        connectors.push(new FlowElementConnector("connector", element.connector, {}));
      }
      if (Array.isArray(element.scheduledPaths)) {
        for (const asyncElement of element?.scheduledPaths || []) {
          if (asyncElement.connector) {
            connectors.push(
              new FlowElementConnector("connector", asyncElement.connector, {
                childName: asyncElement?.name ?? "AsyncAfterCommit",
                childOf: "scheduledPaths",
              })
            );
          }
        }
      } else {
        if (element.scheduledPaths) {
          connectors.push(
            new FlowElementConnector("connector", element.scheduledPaths, {
              childName: element.scheduledPaths.name,
              childOf: "scheduledPaths",
            })
          );
        }
      }
      return connectors;
    } else if (subtype === "decisions") {
      if (element.defaultConnector) {
        connectors.push(new FlowElementConnector("defaultConnector", element.defaultConnector, {}));
      }
      if (element.rules) {
        if (Array.isArray(element.rules)) {
          for (const rule of element.rules) {
            if (rule.connector) {
              connectors.push(
                new FlowElementConnector("connector", rule.connector, {
                  childName: rule.name,
                  childOf: "rules",
                })
              );
            }
          }
        } else {
          if (element.rules.connector) {
            connectors.push(
              new FlowElementConnector("connector", element.rules.connector, {
                childName: element.rules.name,
                childOf: "rules",
              })
            );
          }
        }
      }
      return connectors;
    } else if (
      subtype === "assignments" ||
      subtype === "transforms" ||
      subtype === "customErrors"
    ) {
      return element.connector
        ? [new FlowElementConnector("connector", element.connector, {})]
        : [];
    } else if (subtype === "loops") {
      if (element.nextValueConnector) {
        connectors.push(
          new FlowElementConnector("nextValueConnector", element.nextValueConnector, {})
        );
      }
      if (element.noMoreValuesConnector) {
        connectors.push(
          new FlowElementConnector("noMoreValuesConnector", element.noMoreValuesConnector, {})
        );
      }
      return connectors;
    } else if (subtype === "actionCalls") {
      if (element.connector) {
        connectors.push(new FlowElementConnector("connector", element.connector, {}));
      }
      if (element.faultConnector) {
        connectors.push(new FlowElementConnector("faultConnector", element.faultConnector, {}));
      }
      return connectors;
    } else if (subtype === "waits") {
      if (element.defaultConnector) {
        connectors.push(new FlowElementConnector("defaultConnector", element.defaultConnector, {}));
      }
      if (element.faultConnector) {
        connectors.push(new FlowElementConnector("faultConnector", element.faultConnector, {}));
      }
      if (Array.isArray(element.waitEvents)) {
        for (const waitEvent of element.waitEvents) {
          if (waitEvent.connector) {
            connectors.push(
              new FlowElementConnector("connector", waitEvent.connector, {
                childName: waitEvent.name,
                childOf: "waitEvents",
              })
            );
          }
        }
      }

      return connectors;
    } else if (subtype === "recordCreates") {
      if (element.connector) {
        connectors.push(new FlowElementConnector("connector", element.connector, {}));
      }
      if (element.faultConnector) {
        connectors.push(new FlowElementConnector("faultConnector", element.faultConnector, {}));
      }
      return connectors;
    } else if (subtype === "recordDeletes") {
      if (element.connector) {
        connectors.push(new FlowElementConnector("connector", element.connector, {}));
      }
      if (element.faultConnector) {
        connectors.push(new FlowElementConnector("faultConnector", element.faultConnector, {}));
      }
      return connectors;
    } else if (subtype === "recordLookups") {
      if (element.connector) {
        connectors.push(new FlowElementConnector("connector", element.connector, {}));
      }
      if (element.faultConnector) {
        connectors.push(new FlowElementConnector("faultConnector", element.faultConnector, {}));
      }
      return connectors;
    } else if (subtype === "recordUpdates") {
      if (element.connector) {
        connectors.push(new FlowElementConnector("connector", element.connector, {}));
      }
      if (element.faultConnector) {
        connectors.push(new FlowElementConnector("faultConnector", element.faultConnector, {}));
      }
      return connectors;
    } else if (subtype === "subflows") {
      return element.connector
        ? [new FlowElementConnector("connector", element.connector, {})]
        : [];
    } else if (subtype === "screens") {
      return element.connector
        ? [new FlowElementConnector("connector", element.connector, {})]
        : [];
    } else {
      return element.connector
        ? [new FlowElementConnector("connector", element.connector, {})]
        : [];
    }
  }
}