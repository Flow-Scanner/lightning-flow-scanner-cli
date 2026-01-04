import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";

export class GetRecordAllFields extends RuleCommon implements IRuleDefinition {
  constructor() {
    super(
      {
        ruleId: "get-record-all-fields",
        category: "suggestion",
        description: "Avoid using Get Records to retrieve all fields unless necessary. This improves performance, reduces processing time, and limits exposure of unnecessary data.",
        summary: "Retrieving all fields harms performance and security",
        docRefs: [
          {
            label: "Get Records Stores All Fields",
            path: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_best_practices_soql_and_sosl.htm",
          },
          {
            label: "Indexes | Best Practices",
            path: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_infrastructure_indexes.htm",
          },
        ],
        label: "Get Record All Fields",
        name: "GetRecordAllFields",
        supportedTypes: core.FlowType.allTypes(),
      },
      { severity: "warning" }
    );
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    const lookupNodes = flow.elements?.filter(
      (e) => e.subtype === "recordLookups"
    ) ?? [];

    const violations = lookupNodes
      .filter((node) => {
        const el = (node as core.FlowNode).element as core.FlowElement;

        const storeAllFields =
          typeof el === "object" &&
          "storeOutputAutomatically" in el &&
          el.storeOutputAutomatically;

        // Handle both single field (string) and multiple fields (array)
        const queriedFields = (el as any).queriedFields;
        const hasQueriedFields =
          queriedFields &&
          (
            (Array.isArray(queriedFields) && queriedFields.length > 0) ||
            typeof queriedFields === "string"
          );

        return storeAllFields && !hasQueriedFields;
      })
      .map((node) => new core.Violation(node));

    return violations;
  }

}
