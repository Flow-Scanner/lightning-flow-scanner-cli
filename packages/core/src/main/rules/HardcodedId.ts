import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { HardcodedId as RegexHardcodedId } from "@flow-scanner/regex-scanner";
import { toMetadataFile, toViolations } from "../config/RegexAdapter";

/**
 * Hardcoded Salesforce ID detection rule.
 * This is a wrapper around the regex-scanner's HardcodedId rule,
 * maintaining backward compatibility with the core scanner interface.
 */
export class HardcodedId extends RuleCommon implements IRuleDefinition {
  private regexRule = new RegexHardcodedId();

  constructor() {
    super({
      ruleId: "hardcoded-id",
      name: "HardcodedId",
      category: "problem",
      label: "Hardcoded Salesforce Id",
      description: "Avoid hard-coding record IDs, as they are unique to a specific org and will not work in other environments. Instead, store IDs in variables—such as merge-field URL parameters or a **Get Records** element—to make the Flow portable, maintainable, and flexible.",
      summary: "Hardcoded IDs break portability across environments",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
        {
          label: "Don't hard code Record Type IDs in Flow. By Stephen Church.",
          path: "https://www.linkedin.com/feed/update/urn:li:activity:6947530300012826624/",
        },
      ],
    }, { severity: "error" });
  }

  protected check(
    flow: core.Flow,
    _options: object | undefined,
    _suppressions: Set<string>
  ): core.Violation[] {
    // Convert Flow to MetadataFile for regex-scanner
    const metadataFile = toMetadataFile(flow);

    // Execute regex rule
    const regexViolations = this.regexRule.execute(metadataFile);

    // Convert back to core Violations
    return toViolations(regexViolations);
  }
}
