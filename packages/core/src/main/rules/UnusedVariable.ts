import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class UnusedVariable extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "unused-variable",
      name: "UnusedVariable",
      label: "Unused Variable",
      description: "Unused variables are never referenced and add unnecessary clutter. Remove them to keep Flows efficient and easy to maintain.",
      summary: "Unused variables add clutter and hurt maintainability",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [],
    });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    const variables = flow.elements.filter(
      (node) => node instanceof core.FlowVariable
    ) as core.FlowVariable[];

    const unusedVariables: core.FlowVariable[] = [];

    for (const variable of variables) {
      const variableName = variable.name;

      const nodeMatches = [
        ...JSON.stringify(flow.elements.filter((node) => node instanceof core.FlowNode)).matchAll(
          new RegExp(variableName, "gi")
        ),
      ].map((a) => a.index);

      if (nodeMatches.length > 0) continue;

      const resourceMatches = [
        ...JSON.stringify(flow.elements.filter((node) => node instanceof core.FlowResource)).matchAll(
          new RegExp(variableName, "gi")
        ),
      ].map((a) => a.index);

      if (resourceMatches.length > 0) continue;

      const insideCounter = [
        ...JSON.stringify(variable).matchAll(new RegExp(variable.name, "gi")),
      ].map((a) => a.index);

      const variableUsage = [
        ...JSON.stringify(flow.elements.filter((node) => node instanceof core.FlowVariable)).matchAll(
          new RegExp(variableName, "gi")
        ),
      ].map((a) => a.index);

      if (variableUsage.length === insideCounter.length) {
        unusedVariables.push(variable);
      }
    }

    return unusedVariables.map((variable) => new core.Violation(variable));
  }
}
