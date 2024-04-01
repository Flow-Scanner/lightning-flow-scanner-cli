import {FlowAttribute} from "./FlowAttribute";
import {FlowNode} from "./FlowNode";
import {FlowVariable} from "./FlowVariable";

export class ResultDetails {

    public violation: FlowNode | FlowVariable | FlowAttribute;
    public name: string;
    public type: string;
    public metaType: string;
    public details: {};

    constructor(violation: FlowNode | FlowVariable | FlowAttribute) {
        this.violation = violation;
        this.name = violation.name;
        this.metaType = violation.metaType;
        this.type = violation.subtype;
        if(violation.metaType === 'variable'){
            let element = violation as FlowVariable;
            this.details = {dataType: element.dataType}
        }
        if (violation.metaType === 'node') {
            let element = violation as FlowNode;
            this.details = {locationX: element.locationX, locationY: element.locationY, connectsTo: element.connectors.map(connector => connector.reference)}
        }
        if (violation.metaType === 'attribute'){
            let element = violation as FlowAttribute;
            this.details = {expression: element.expression}
        }
    }
}
