import {Flow} from "../models/Flow";
import {FlowElement} from "../models/FlowElement";

export class MissingFaultPath{

    public execute(flow: Flow) {

        const typesWithFaultPath = ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'];
        const flowElementsWhereFaultPathIsApplicable: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement && typesWithFaultPath.includes(node.subtype)) as FlowElement[];
        const elementsWithoutFaultPath: FlowElement[] = [];
        for(const element of flowElementsWhereFaultPathIsApplicable){
            if(!element.connectors.find(connector => 'faultConnector' === connector.type)){
                elementsWithoutFaultPath.push(element);
            }
        }
        return elementsWithoutFaultPath;
    }
}
