import { FlowElement } from './FlowElement';

export class FlowVariable extends FlowElement {

    public name: string;
    public dataType;

    constructor(name: string, subtype: string, element: object) {
        super('variable', subtype, element);
        this.name = name[0];

        // todo datatype
        // this.dataType = element[dataType[];
    }
}
