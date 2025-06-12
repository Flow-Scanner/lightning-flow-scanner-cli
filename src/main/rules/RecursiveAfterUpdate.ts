import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class RecursiveAfterUpdate extends AdvancedRule implements core.IRuleDefinition {
  protected qualifiedRecordTriggerTypes: Set<string> = new Set<string>([
    "Create",
    "CreateAndUpdate",
    "Update",
  ]);

  constructor() {
    super(
      {
        autoFixable: false,
        description:
          "After updates are meant to be used for record modifications that are not the same record that triggered the flow. Using after updates on the same record can lead to recursion and unexpected behavior. Consider using before save flows for same record updates.",
        docRefs: [
          {
            label: "Learn about same record field updates",
            path: "https://architect.salesforce.com/decision-guides/trigger-automation#Same_Record_Field_Updates",
          },
        ],
        isConfigurable: false,
        label: "Recursive After Update",
        name: "RecursiveAfterUpdate",
        supportedTypes: [...core.FlowType.backEndTypes],
      },
      { severity: "warning" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];

    const isAfterSave = flow.start?.triggerType === "RecordAfterSave";
    const isQualifiedTriggerTypes = this.qualifiedRecordTriggerTypes.has(
      flow.start?.recordTriggerType
    );

    if (!isAfterSave || !isQualifiedTriggerTypes) {
      return new core.RuleResult(this, results);
    }

    const potentialElements = flow.elements?.filter(
      (node) => node.subtype === "recordUpdates"
    ) as core.FlowNode[];

    if (potentialElements == null || typeof potentialElements[Symbol.iterator] !== "function") {
      return new core.RuleResult(this, results);
    }

    for (const node of potentialElements) {
      if (
        typeof node.element === "object" &&
        "inputReference" in node.element &&
        node.element.inputReference === "$Record"
      ) {
        results.push(new core.ResultDetails(node));
      }
    }

    // do another search for record updates from lookups with the same object type
    // and check whether there is references on record updates

    const lookupElementsWithTheSameObjectType = flow.elements
      ?.filter(
        (node) =>
          node.subtype === "recordLookups" &&
          typeof node.element === "object" &&
          "object" in node.element &&
          flow.start.object === node.element["object"]
      )
      ?.map((node) => {
        return node.name;
      });

    if (
      lookupElementsWithTheSameObjectType == null ||
      typeof lookupElementsWithTheSameObjectType[Symbol.iterator] !== "function"
    ) {
      return new core.RuleResult(this, results);
    }

    for (const node of potentialElements) {
      if (
        typeof node.element === "object" &&
        "inputReference" in node.element &&
        lookupElementsWithTheSameObjectType.includes(node.element.inputReference as string)
      ) {
        results.push(new core.ResultDetails(node));
      }
    }

    return new core.RuleResult(this, results);
  }
}
