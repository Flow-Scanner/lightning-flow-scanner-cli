import { AdvancedRule } from "../models/AdvancedRule";
import * as core from "../internals/internals";

export class UnusedVariable extends AdvancedRule implements core.IRuleDefinition {
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

  public execute(flow: core.Flow): core.RuleResult {
    const unusedVariables: core.FlowVariable[] = [];
    for (const variable of flow.elements.filter(
      (node) => node instanceof core.FlowVariable
    ) as core.FlowVariable[]) {
      const variableName = variable.name;
      if (
        [
          ...JSON.stringify(flow.elements.filter((node) => node instanceof core.FlowNode)).matchAll(
            new RegExp(variableName, "gi")
          ),
        ].map((a) => a.index).length === 0
      ) {
        // if not found in any inside of flow elements

        if (
          [
            ...JSON.stringify(
              flow.elements.filter((node) => node instanceof core.FlowResource)
            ).matchAll(new RegExp(variableName, "gi")),
          ].map((a) => a.index).length === 0
        ) {
          const insideCounter = [
            ...JSON.stringify(variable).matchAll(new RegExp(variable.name, "gi")),
          ].map((a) => a.index);
          const variableUsage = [
            ...JSON.stringify(
              flow.elements.filter((node) => node instanceof core.FlowVariable)
            ).matchAll(new RegExp(variableName, "gi")),
          ].map((a) => a.index);
          // finally also checks indexes where name occurs in the variable itself and where name occurs in all variables
          // when this is the same, variable must be unused.
          if (variableUsage.length === insideCounter.length) {
            unusedVariables.push(variable);
          }
        }
      }
    }
    const results = [];
    for (const det of unusedVariables) {
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }
}
