export class FlowNode{

    public subtype:string;
    public nodeType:string;
    public element:object = {};

    constructor(nodeType:string, subtype:string, element:object){

        this.element = element;
        this.subtype = subtype;
        this.nodeType = nodeType;
    }
}
