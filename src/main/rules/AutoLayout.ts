import * as core from '../internals/internals';
import { RuleCommon } from '../models/RuleCommon';

export class AutoLayout extends RuleCommon implements core.IRuleDefinition {

    constructor() {
        super({
            name: 'AutoLayout',
            label: 'Use Auto-Layout Mode',
            description: " With Auto-Layout Elements on the canvas are spaced, connected, and aligned automatically, saving you time and keeping your canvas neatly organized.",
            type: 'flow',
            supportedTypes: core.FlowType.allTypes(),
            docRefs: [],
            isConfigurable: true,
            autoFixable: false
        });
    }

    public execute(flow: core.Flow, options?: { expression: string }): core.RuleResult {

        if (flow.xmldata.processMetadataValues && flow.xmldata.processMetadataValues[0]) {

            const CanvasMode = flow.xmldata.processMetadataValues.find(mdv => mdv.name[0] === 'CanvasMode');
            const AutoLayout = CanvasMode.value[0] && typeof CanvasMode.value[0] === 'object' && 'stringValue' in CanvasMode.value[0] && Array.isArray(CanvasMode.value[0].stringValue) && CanvasMode.value[0].stringValue[0] === "AUTO_LAYOUT_CANVAS";
            return (!AutoLayout ?
                new core.RuleResult(this, [new core.ResultDetails(new core.FlowAttribute('CanvasMode', "autoLayout"))]) :
                new core.RuleResult(this, []));
        }
    }
}