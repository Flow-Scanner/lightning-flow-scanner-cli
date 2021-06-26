export class FlowElementConnector{

    public type:string;
    public element:object = {};
    public processed = false;
    public alias:string;
    public reference:string;
    public childName:string;
    public childOf:string;

    constructor(type:string, element:object, args){
        this.type = type;
        this.element = element;
        this.childName = args.childName ? args.childName : undefined;
        this.childOf = args.childOf ? args.childOf : undefined;

        if(element && element[0] && element[0].targetReference && element[0].targetReference[0]){
            this.reference = element[0].targetReference[0];
        }
    }
}
