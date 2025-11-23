import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class AutoLayout extends RuleCommon implements IRuleDefinition {
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

  public execute(
    flow: core.Flow,
    options?: { expression: string },
    suppressions: string[] = []
  ): core.RuleResult {
    return this.executeWithSuppression(flow, options, suppressions, (suppSet) => {
      if (!flow.processMetadataValues) {
        return new core.RuleResult(this, []);
      }

      const CanvasMode = flow.xmldata.processMetadataValues.find(
        (mdv) => mdv.name === "CanvasMode"
      );

      const autoLayout =
        CanvasMode?.value &&
        typeof CanvasMode.value === "object" &&
        CanvasMode.value.stringValue === "AUTO_LAYOUT_CANVAS";

      if (autoLayout) {
        return new core.RuleResult(this, []);
      }

      const detail = new core.Violation(
        new core.FlowAttribute(
          CanvasMode?.value?.stringValue ?? "undefined",
          "CanvasMode",
          "!== AUTO_LAYOUT_CANVAS"
        )
      );

      if (suppSet.has(detail.name)) {
        return new core.RuleResult(this, []);
      }

      return new core.RuleResult(this, [detail]);
    });
  }
}