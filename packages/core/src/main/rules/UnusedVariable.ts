import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

/**
 * Count non-overlapping case-insensitive literal occurrences of `needle` in `haystack`.
 *
 * Variable names come from scanned Flow metadata and must never be compiled as RegExp
 * patterns (CWE-1333 / GHSA-fpvw-w7ff-h7vr). This preserves the previous "gi" substring
 * semantics without invoking the regex engine.
 */
export function countLiteralOccurrences(haystack: string, needle: string): number {
  if (!needle) {
    return 0;
  }

  const lowerHaystack = haystack.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  let count = 0;
  let fromIndex = 0;

  while (fromIndex <= lowerHaystack.length - lowerNeedle.length) {
    const foundAt = lowerHaystack.indexOf(lowerNeedle, fromIndex);
    if (foundAt === -1) {
      break;
    }
    count += 1;
    fromIndex = foundAt + lowerNeedle.length;
  }

  return count;
}

export class UnusedVariable extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "unused-variable",
      category: "layout",
      name: "UnusedVariable",
      label: "Unused Variable",
      description:
        "Unused variables are never referenced and add unnecessary clutter. Remove them to keep Flows efficient and easy to maintain.",
      summary: "Unused variables add clutter and hurt maintainability",
      supportedTypes: [...core.FlowType.backEndTypes, ...core.FlowType.visualTypes],
      docRefs: [],
      isFixable: true,
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

    // Serialize once per collection — same search surface as before, without per-variable RegExp.
    const nodesJson = JSON.stringify(
      flow.elements.filter((node) => node instanceof core.FlowNode)
    );
    const resourcesJson = JSON.stringify(
      flow.elements.filter((node) => node instanceof core.FlowResource)
    );
    const variablesJson = JSON.stringify(
      flow.elements.filter((node) => node instanceof core.FlowVariable)
    );

    const unusedVariables: core.FlowVariable[] = [];

    for (const variable of variables) {
      const variableName = variable.name;

      if (countLiteralOccurrences(nodesJson, variableName) > 0) {
        continue;
      }

      if (countLiteralOccurrences(resourcesJson, variableName) > 0) {
        continue;
      }

      const insideCounter = countLiteralOccurrences(JSON.stringify(variable), variableName);
      const variableUsage = countLiteralOccurrences(variablesJson, variableName);

      if (variableUsage === insideCounter) {
        unusedVariables.push(variable);
      }
    }

    return unusedVariables.map((variable) => new core.Violation(variable));
  }
}
