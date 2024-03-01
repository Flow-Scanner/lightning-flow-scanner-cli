import { FlowElement } from './FlowElement';

export default class FlowVariable extends FlowElement {

    public name: string;
    public dataType: string;

    constructor(name: string, subtype: string, element: object) {
        super('variable', subtype, element);
        this.name = name[0];
        this.dataType = element["dataType"][0];
    }
}
