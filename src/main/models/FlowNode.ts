import { FlowElementConnector } from './FlowElementConnector';
import { FlowElement } from './FlowElement';

export default class FlowNode extends FlowElement {

    public connectors: FlowElementConnector[] = [];
    public name: string;
    public locationX: string;
    public locationY: string;

    constructor(name: string, subtype: string, element: object) {
        super('node', subtype, element);
        this.name = (subtype === 'start' ? 'flowstart' : name[0]);
        const connectors = this.getConnectors(subtype, element);
        if (connectors.length > 0 && connectors[0] !== undefined) {
            this.connectors = connectors;
        }
        this.locationX = element["locationX"][0];
        this.locationY = element["locationY"][0];
    }

    private getConnectors(subtype, element) {

        if (subtype === 'start') {
            const connectors = [];
            connectors.push(
                new FlowElementConnector('connector', element.connector, {})
            );
            if (Array.isArray(element.scheduledPaths)) {
                for (const asyncElement of element?.scheduledPaths) {
                    if (asyncElement.connector) {
                        connectors.push(
                            new FlowElementConnector('connector', asyncElement.connector, {
                                childName: asyncElement?.name?.[0] ?? 'AsyncAfterCommit',
                                childOf: 'rules'
                            })
                        )
                    }
                }
            }
            return connectors;
        } else if (subtype === 'decisions') {
            const connectors = [];
            connectors.push(
                new FlowElementConnector('defaultConnector', element.defaultConnector, {})
            );
            for (const rule of element.rules) {
                if (rule.connector) {
                    connectors.push(
                        new FlowElementConnector('connector', rule.connector, {
                            childName: rule.name[0],
                            childOf: 'rules'
                        })
                    );
                }
            }
            return connectors;
        } else if (subtype === 'assignments') {
            return [new FlowElementConnector('connector', element.connector, {})];
        } else if (subtype === 'loops') {
            return [
                new FlowElementConnector(
                    'nextValueConnector',
                    element.nextValueConnector,
                    {}
                ),
                new FlowElementConnector(
                    'noMoreValuesConnector',
                    element.noMoreValuesConnector,
                    {}
                )
            ];
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
            for (const waitEvent of element.waitEvents) {
                if (waitEvent.connector) {
                    connectors.push(
                        new FlowElementConnector('connector', waitEvent.connector, {
                            childName: waitEvent.name[0],
                            childOf: 'rules'
                        })
                    );
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
            return [new FlowElementConnector('connector', element.connector, {})];
        } else if (subtype === 'screens') {
            return [new FlowElementConnector('connector', element.connector, {})];
        } else {
            return [new FlowElementConnector('connector', element.connector, {})];
        }
    }
}