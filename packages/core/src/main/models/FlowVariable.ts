import { MetaType } from "../enums/MetadataTypes";
import { FlowElement } from "./FlowElement";
import { DEFAULT_VARIABLE_ICONS, ASCII_VARIABLE_ICONS, type VariableIconConfig } from "../config/VariableIcons";

export class FlowVariable extends FlowElement {
  public dataType?: string;
  public isCollection?: boolean;
  public isInput?: boolean;
  public isOutput?: boolean;
  public objectType?: string;
  public description?: string;
  public value?: any;

  // Static icon configuration (can be overridden)
  private static iconConfig: VariableIconConfig = DEFAULT_VARIABLE_ICONS;

  /**
   * Set custom icon configuration for all FlowVariables
   * @example
   * ```typescript
   * // Use ASCII icons
   * FlowVariable.setIconConfig(ASCII_VARIABLE_ICONS);
   * 
   * // Or provide custom icons
   * FlowVariable.setIconConfig({
   *   subtypes: {
   *     variables: '[VAR]',
   *     constants: '[CONST]'
   *   },
   *   boolean: {
   *     true: '[YES]',
   *     false: '[NO]'
   *   }
   * });
   * ```
   */
  public static setIconConfig(config: VariableIconConfig): void {
    FlowVariable.iconConfig = config;
  }

  /**
   * Use ASCII icons instead of emoji
   */
  public static useAsciiIcons(): void {
    FlowVariable.iconConfig = ASCII_VARIABLE_ICONS;
  }

  /**
   * Reset to default emoji icons
   */
  public static useDefaultIcons(): void {
    FlowVariable.iconConfig = DEFAULT_VARIABLE_ICONS;
  }

  constructor(name: string, subtype: string, element: object) {
    super(MetaType.VARIABLE, subtype, name, element);
    
    // Extract properties based on variable subtype
    this.dataType = element["dataType"];
    this.isCollection = element["isCollection"];
    this.isInput = element["isInput"];
    this.isOutput = element["isOutput"];
    this.objectType = element["objectType"];
    this.description = element["description"];
    
    // Different subtypes have different value properties
    if (subtype === "constants") {
      this.value = element["value"];
    } else if (subtype === "formulas") {
      this.value = element["expression"];
    }
  }

  /**
   * Get the icon for this variable subtype
   */
  public getIcon(): string {
    return FlowVariable.iconConfig.subtypes[this.subtype] || '\uD83D\uDCCA'; // 📊 default
  }

  /**
   * Get icon for a boolean value
   */
  private getBooleanIcon(value?: boolean): string {
    if (value === true) {
      return FlowVariable.iconConfig.boolean.true;
    } else if (value === false) {
      return FlowVariable.iconConfig.boolean.false;
    }
    return ''; // undefined/null
  }

  /**
   * Get a human-readable type label
   */
  public getTypeLabel(): string {
    const labelMap: Record<string, string> = {
      variables: 'Variable',
      constants: 'Constant',
      formulas: 'Formula',
      choices: 'Choice',
      dynamicChoiceSets: 'Dynamic Choice',
    };
    return labelMap[this.subtype] || this.subtype;
  }

  /**
   * Get a markdown table row for this variable
   */
  public toTableRow(): string {
    const parts = [
      this.name,
      this.dataType || '',
      this.getBooleanIcon(this.isCollection),
      this.getBooleanIcon(this.isInput),
      this.getBooleanIcon(this.isOutput),
      this.objectType || '',
      this.description || ''
    ];
    return `| ${parts.join(' | ')} |`;
  }

  /**
   * Get a detailed markdown table for this variable
   */
  public toMarkdownTable(): string {
    let table = '| Property | Value |\n|:---|:---|\n';
    
    table += `| Name | ${this.name} |\n`;
    table += `| Type | ${this.getIcon()} ${this.getTypeLabel()} |\n`;
    
    if (this.dataType) table += `| Data Type | ${this.dataType} |\n`;
    if (this.objectType) table += `| Object Type | ${this.objectType} |\n`;
    if (this.isCollection !== undefined) {
      table += `| Collection | ${this.getBooleanIcon(this.isCollection)} |\n`;
    }
    if (this.isInput !== undefined) {
      table += `| Input | ${this.getBooleanIcon(this.isInput)} |\n`;
    }
    if (this.isOutput !== undefined) {
      table += `| Output | ${this.getBooleanIcon(this.isOutput)} |\n`;
    }
    if (this.value !== undefined) {
      table += `| Value | ${this.formatValue(this.value)} |\n`;
    }
    if (this.description) table += `| Description | ${this.description} |\n`;
    
    return table;
  }

  private formatValue(value: any): string {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
}