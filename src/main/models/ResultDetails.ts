import { FlowAttribute } from "./FlowAttribute";
import { FlowNode } from "./FlowNode";
import { FlowVariable } from "./FlowVariable";

export class ResultDetails {

    public violation: FlowNode | FlowVariable | FlowAttribute;
    public name: string;
    public type: string;
    public metaType: string;
    public locationX?: string;
    public locationY?: string;
    public connectsTo?: string[];
    public attributeExpression?: string;
    public details: {};

    constructor(violation: FlowNode | FlowVariable | FlowAttribute) {
        this.violation = violation;
        this.name = violation.name;
        this.metaType = violation.metaType;
        this.type = violation.subtype;
        if (violation.metaType === 'node') {
            let element = violation as FlowNode;
            if (element.connectors) {
                this.connectsTo = element.connectors.map(connector => connector.reference);
            }
            if (element.element["locationX"]) {
                this.locationX = element.element["locationX"];
            }
            if (element.element["locationY"]) {
                this.locationY = element.element["locationY"];
            }
        }
        if (violation.metaType === 'attribute'){
            let element = violation as FlowAttribute;
            this.attributeExpression = element.expression;
        }

    
    }
}
