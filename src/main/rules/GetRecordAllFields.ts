import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class GetRecordAllFields extends AdvancedRule implements core.IRuleDefinition {
  constructor() {
    super(
      {
        autoFixable: false,
        description:
          "Following the principle of least privilege (PoLP), avoid using Get Records with 'Automatically store all fields' unless necessary.",
        docRefs: [
          {
            label: "SOQL and SOSL | Best Practices for Deployments with Large Data Volumes",
            path: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_best_practices_soql_and_sosl.htm",
          },
          {
            label: "Indexes | Best Practices",
            path: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_infrastructure_indexes.htm",
          },
        ],
        isConfigurable: false,
        label: "Get Record All Fields",
        name: "GetRecordAllFields",
        supportedTypes: core.FlowType.allTypes(),
      },
      { severity: "warning" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];
    const getElementNodes = flow.elements?.filter((element) => element.subtype === "recordLookups");
    if (getElementNodes == null || getElementNodes.length === 0) {
      return new core.RuleResult(this, results);
    }

    const errorNodes: core.ResultDetails[] = getElementNodes
      .filter((element) => {
        const getRecordElement = element as core.FlowNode;
        const hasQualifiedElementDefinition = typeof getRecordElement.element === "object";
        if (!hasQualifiedElementDefinition) {
          return false;
        }

        const concreteChildElement = getRecordElement.element as core.FlowElement;

        const storeAllFields =
          "storeOutputAutomatically" in concreteChildElement &&
          concreteChildElement["storeOutputAutomatically"];
        const hasQueriedFields =
          "queriedFields" in concreteChildElement &&
          (concreteChildElement["queriedFields"] as string[]).length > 0;

        return storeAllFields && !hasQueriedFields;
      })
      .map((element) => {
        const getRecordElement = element as core.FlowNode;
        return new core.ResultDetails(getRecordElement);
      });

    results.push(...errorNodes);
    return new core.RuleResult(this, results);
  }
}
