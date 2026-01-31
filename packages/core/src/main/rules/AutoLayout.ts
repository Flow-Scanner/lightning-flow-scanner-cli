import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
export class AutoLayout extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "missing-auto-layout",
      category: "layout",
      name: "AutoLayout",
      label: "Missing Auto Layout",
      description: "Auto-Layout automatically arranges and aligns Flow elements, keeping the canvas organized and easier to maintain. Enabling it saves time and improves readability.",
      summary: "Auto-Layout improves canvas organization and readability",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isFixable: true,
    }, { severity: "note" });
  }
  
  protected check(
    flow: core.Flow,
    _options: object | undefined
  ): core.Violation[] {
    if (!flow.processMetadataValues) return [];

    const CanvasMode = flow.xmldata.processMetadataValues.find(
      (mdv) => mdv.name === "CanvasMode"
    );

    const autoLayout =
      CanvasMode?.value &&
      typeof CanvasMode.value === "object" &&
      CanvasMode.value.stringValue === "AUTO_LAYOUT_CANVAS";

    if (autoLayout) return [];

    return [
      new core.Violation(
        new core.FlowAttribute(
          CanvasMode?.value?.stringValue ?? "undefined",
          "CanvasMode",
          "!== AUTO_LAYOUT_CANVAS"
        )
      )
    ];
  }

}