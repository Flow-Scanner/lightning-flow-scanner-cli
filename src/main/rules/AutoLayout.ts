import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class AutoLayout extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super({
      name: "AutoLayout",
      label: "Auto-Layout Mode",
      description:
        "With Canvas Mode set to Auto-Layout, Elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized thus saving you time.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: true,
      autoFixable: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(flow: core.Flow, options?: { expression: string }): core.RuleResult {
    if (flow.processMetadataValues) {
      const CanvasMode = flow.xmldata.processMetadataValues.find(
        (mdv) => mdv.name === "CanvasMode"
      );
      const autoLayout =
        CanvasMode.value &&
        typeof CanvasMode.value === "object" &&
        CanvasMode.value.stringValue &&
        CanvasMode.value.stringValue === "AUTO_LAYOUT_CANVAS";
      return !autoLayout
        ? new core.RuleResult(this, [
            new core.ResultDetails(
              new core.FlowAttribute(
                CanvasMode.value?.stringValue,
                "CanvasMode",
                "!== AUTO_LAYOUT_CANVAS"
              )
            ),
          ])
        : new core.RuleResult(this, []);
    }
    return new core.RuleResult(this, []);
  }
}
