import {FlowNode} from './FlowNode';

export class FlowVariable extends FlowNode{

        public name:string;

        constructor(name:string, subtype:string, element:object){
            super('variable', subtype, element);
            this.name = name[0];
        }
}
