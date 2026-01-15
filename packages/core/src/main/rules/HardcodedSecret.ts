import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";
import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { HardcodedSecret as RegexHardcodedSecret } from "@flow-scanner/regex-scanner";
import { toMetadataFile, toViolations } from "../config/RegexAdapter";

/**
 * Hardcoded secrets detection rule.
 * This is a wrapper around the regex-scanner's HardcodedSecret rule,
 * maintaining backward compatibility with the core scanner interface.
 */
export class HardcodedSecret extends RuleCommon implements IRuleDefinition {
  private regexRule = new RegexHardcodedSecret();

  constructor() {
    super({
      ruleId: "hardcoded-secret",
      name: "HardcodedSecret",
      category: "problem",
      label: "Hardcoded Secret",
      description: "Avoid hardcoding secrets, API keys, tokens, or credentials in Flows. These should be stored securely in Named Credentials, Custom Settings, Custom Metadata, or external secret management systems.",
      summary: "Hardcoded secrets pose security risks",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [
        {
          label: "Salesforce Named Credentials",
          path: "https://help.salesforce.com/s/articleView?id=sf.named_credentials_about.htm",
        },
        {
          label: "OWASP Secrets Management Cheat Sheet",
          path: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
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
