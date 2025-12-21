import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class TransformInsteadOfLoop extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      ruleId: "transform-instead-of-loop",
      name: "TransformInsteadOfLoop",
      label: "Transform Instead of Loop",
      description:
        "Detects Loop elements that directly connect to Assignment elements. This pattern can often be replaced with the Transform element, which is on average 10x more performant according to Salesforce documentation.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [
        {
          label: "Transform Multiple Records - Trailhead",
          path: "https://trailhead.salesforce.com/content/learn/modules/multirecord-elements-and-transforms-in-flows/transform-multiple-records",
        },
      ],
    }, { severity: "note" });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    const violations: core.Violation[] = [];

    const triggerType = this.getStartProperty(flow, 'triggerType');
    const isRecordBeforeSave = triggerType === "RecordBeforeSave";
    if (isRecordBeforeSave) {
      return violations;
    }

    const loops = flow.graph.getLoopNodes();

    for (const loopNode of loops) {
      // Get elements that the loop connects to (includes nextValueConnector)
      const nextElements = flow.graph.getNextElements(loopNode.name);

      // Check if any directly connected element is an assignment
      for (const nextElementName of nextElements) {
        const nextElement = flow.graph.getNode(nextElementName);

        if (nextElement?.subtype === "assignments") {
          violations.push(new core.Violation(loopNode));
          break; // Only report once per loop
        }
      }
    }

    return violations;
  }
}