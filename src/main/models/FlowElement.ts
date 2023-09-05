export class FlowElement{

    public subtype:string;
    public metaType:string;
    public element:object = {};

    constructor(metaType:string, subtype:string, element:object){

        this.element = element;
        this.subtype = subtype;
        this.metaType = metaType;
    }
}
