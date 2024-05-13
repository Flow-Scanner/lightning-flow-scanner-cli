import { FlowElementConnector } from './FlowElementConnector';
import {FlowElement} from './FlowElement';

export class FlowNode extends FlowElement {

    public connectors: FlowElementConnector[] = [];
    public name: string;
    public locationX: string;
    public locationY: string;

    constructor(provName: string, subtype: string, element: object) {
        super('node', subtype, element);
        let nodeName = subtype === 'start' ? 'flowstart' : provName;
        this.name = nodeName;
        const connectors = this.getConnectors(subtype, element);
        this.connectors = connectors;
        this.locationX = element["locationX"];
        this.locationY = element["locationY"];
    }

    private getConnectors(subtype, element) {

        if (subtype === 'start') {
            const connectors = [];
            if(element.connector){
                connectors.push(
                    new FlowElementConnector('connector', element.connector, {})
                );
            }
            if (Array.isArray(element.scheduledPaths)) {
                for (const asyncElement of element?.scheduledPaths) {
                    if (asyncElement.connector) {
                        connectors.push(
                            new FlowElementConnector('connector', asyncElement.connector, {
                                childName: asyncElement?.name ?? 'AsyncAfterCommit',
                                childOf: 'scheduledPaths'
                            })
                        )
                    }
                }
            } else {
                if (element.scheduledPaths) {
                    connectors.push(
                        new FlowElementConnector('connector', element.scheduledPaths, {
                            childName: element.scheduledPaths.name,
                            childOf: 'scheduledPaths'
                        })
                    );
                }
            }
            return connectors;
        } else if (subtype === 'decisions') {
            const connectors = [];
            if(element.defaultConnector){
                connectors.push(
                    new FlowElementConnector('defaultConnector', element.defaultConnector, {})
                );
            }
            if(element.rules){
                if (Array.isArray(element.rules)) {
                    for (const rule of element.rules) {
                        if (rule.connector) {
                            connectors.push(
                                new FlowElementConnector('connector', rule.connector, {
                                    childName: rule.name,
                                    childOf: 'rules'
                                })
                            );
                        }
                    }
                } else {
                    if (element.rules.connector) {
                        connectors.push(
                            new FlowElementConnector('connector', element.rules.connector, {
                                childName: element.rules.name,
                                childOf: 'rules'
                            })
                        );
                    }
                }
            }
            return connectors;
        } else if (subtype === 'assignments') {
            return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
        } else if (subtype === 'loops') {
            const connectors = [];
            if(element.nextValueConnector){
                connectors.push(new FlowElementConnector(
                    'nextValueConnector',
                    element.nextValueConnector,
                    {}
                ))
            }
            if(element.noMoreValuesConnector){
                connectors.push(new FlowElementConnector(
                    'noMoreValuesConnector',
                    element.noMoreValuesConnector,
                    {}
                ))
            }
            return connectors;
        } else if (subtype === 'actionCalls') {
            const connectors = [];
            if (element.connector) {
                connectors.push(new FlowElementConnector('connector', element.connector, {}));
            }
            if (element.faultConnector) {
                connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
            }
            return connectors;
        } else if (subtype === 'waits') {
            const connectors = [];
            if (element.defaultConnector) {
                connectors.push(
                    new FlowElementConnector('defaultConnector', element.defaultConnector, {})
                );
            }
            if (element.faultConnector) {
                connectors.push(
                    new FlowElementConnector('faultConnector', element.faultConnector, {})
                );
            }
            if (Array.isArray(element.waitEvents)) {
                for (const waitEvent of element.waitEvents) {
                    if (waitEvent.connector) {
                        connectors.push(
                            new FlowElementConnector('connector', waitEvent.connector, {
                                childName: waitEvent.name,
                                childOf: 'waitEvents'
                            })
                        );
                    }
                }
            }
            
            return connectors;
        } else if (subtype === 'recordCreates') {
            const connectors = [];
            if (element.connector) {
                connectors.push(new FlowElementConnector('connector', element.connector, {}));
            }
            if (element.faultConnector) {
                connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
            }
            return connectors;
        } else if (subtype === 'recordDeletes') {
            const connectors = [];
            if (element.connector) {
                connectors.push(new FlowElementConnector('connector', element.connector, {}));
            }
            if (element.faultConnector) {
                connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
            }
            return connectors;
        } else if (subtype === 'recordLookups') {
            const connectors = [];
            if (element.connector) {
                connectors.push(new FlowElementConnector('connector', element.connector, {}));
            }
            if (element.faultConnector) {
                connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
            }
            return connectors;
        } else if (subtype === 'recordUpdates') {
            const connectors = [];
            if (element.connector) {
                connectors.push(new FlowElementConnector('connector', element.connector, {}));
            }
            if (element.faultConnector) {
                connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
            }
            return connectors;
        } else if (subtype === 'subflows') {
            return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
        } else if (subtype === 'screens') {
            return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
        } else {
            return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
        }
    }
}