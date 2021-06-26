import {Flow} from '../models/Flow';
import {FlowElement} from '../models/FlowElement';
import {FlowElementConnector} from '../models/FlowElementConnector';

export class DuplicateDMLOperationsByNavigation {

    public execute(flow: Flow) {

        const dmlStatementTypes = ['recordDeletes', 'recordUpdates', 'recordCreates'];
        const flowElements: FlowElement[] = flow.nodes.filter(node => node instanceof FlowElement) as FlowElement[];
        const screenElements: FlowElement[] = flow.nodes.filter(node => node.subtype === 'screens') as FlowElement[];
        const duplicateDMLOperationsByNavigation: FlowElement[] = [];

        for (const element of screenElements) {
            let startIndex;
            let indexesToProcess: number [];

            const connector: FlowElementConnector = this.findStartReference(element);
            if(connector && connector.reference){
                startIndex = flowElements.findIndex(element => element.name === connector.reference);
                indexesToProcess = [startIndex];
            }

            const processedElementIndexes: number[] = [];
            const unconnectedElementIndexes: number[] = [];
            const dmlBeforeNextScreen: number[] = [];

            if(!indexesToProcess){
                continue;
            }
            do {
                indexesToProcess = indexesToProcess.filter(index => !processedElementIndexes.includes(index));
                if (indexesToProcess.length > 0) {
                    for (const [index, elem] of flowElements.entries()) {
                        if (indexesToProcess.includes(index)) {
                            const connectors = [];
                            for (const connector of elem.connectors) {
                                if (connector.reference) {
                                    connectors.push(connector);
                                }
                            }
                            if(dmlStatementTypes.includes(elem.subtype)) {
                                dmlBeforeNextScreen.push(index);
                            }
                            if (connectors.length > 0) {
                                const elementsByReferences = flowElements.filter(element => connectors.map(c => c.reference).includes(element.name));
                                for (const nextElement of elementsByReferences) {
                                    const nextIndex = flowElements.findIndex(element => nextElement.name === element.name);
                                    if('screens' === nextElement.subtype){
                                    //    todo check if nextelement has previous
                                        // @ts-ignore
                                        if (dmlBeforeNextScreen.length > 0 && nextElement.element.allowBack && nextElement.element.allowBack[0] == 'true'){
                                            duplicateDMLOperationsByNavigation.push(nextElement);
                                        }
                                    } else if (!processedElementIndexes.includes(nextIndex)){
                                        indexesToProcess.push(nextIndex);
                                    }
                                }
                            }
                            processedElementIndexes.push(index);
                        }
                    }
                } else {
                    for (const index of flowElements.keys()) {
                        if (!processedElementIndexes.includes(index)) {
                            unconnectedElementIndexes.push(index);
                            unconnectedElementIndexes.push(index);
                        }
                    }
                }
            } while ((processedElementIndexes.length + unconnectedElementIndexes.length) < flowElements.length);
        }
        return duplicateDMLOperationsByNavigation;
    }

    private findStartReference(element: FlowElement) {
        return element.connectors.find(el => el.type === 'connector');
    }

}
