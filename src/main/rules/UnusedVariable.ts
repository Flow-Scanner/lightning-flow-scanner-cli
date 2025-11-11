import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class UnusedVariable extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      name: "UnusedVariable",
      label: "Unused Variable",
      description:
        "To maintain the efficiency and manageability of your Flow, it's advisable to avoid including unconnected variables that are not in use.",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [],
      isConfigurable: false,
      autoFixable: true,
    });
  }

  public execute(
    flow: core.Flow,
    options?: object,
    suppressions: string[] = []
  ): core.RuleResult {
    return this.executeWithSuppression(flow, options, suppressions, (suppSet) => {
      const unusedVariables: core.FlowVariable[] = [];

      for (const variable of flow.elements.filter(
        (node) => node instanceof core.FlowVariable
      ) as core.FlowVariable[]) {
        const variableName = variable.name;

        // Skip if suppressed
        if (suppSet.has(variableName)) continue;

        const nodeMatches = [
          ...JSON.stringify(flow.elements.filter((node) => node instanceof core.FlowNode)).matchAll(
            new RegExp(variableName, "gi")
          ),
        ].map((a) => a.index);

        if (nodeMatches.length > 0) continue;

        const resourceMatches = [
          ...JSON.stringify(
            flow.elements.filter((node) => node instanceof core.FlowResource)
          ).matchAll(new RegExp(variableName, "gi")),
        ].map((a) => a.index);

        if (resourceMatches.length > 0) continue;

        const insideCounter = [
          ...JSON.stringify(variable).matchAll(new RegExp(variable.name, "gi")),
        ].map((a) => a.index);

        const variableUsage = [
          ...JSON.stringify(
            flow.elements.filter((node) => node instanceof core.FlowVariable)
          ).matchAll(new RegExp(variableName, "gi")),
        ].map((a) => a.index);

        if (variableUsage.length === insideCounter.length) {
          unusedVariables.push(variable);
        }
      }

      const results = unusedVariables.map((det) => new core.ResultDetails(det));
      return new core.RuleResult(this, results);
    });
  }
}