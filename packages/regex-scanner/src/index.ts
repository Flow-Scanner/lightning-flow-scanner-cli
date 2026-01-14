// Models
export { MetadataFile, MetadataElement } from "./models/MetadataFile";
export {
  RegexViolation,
  RegexRuleConfig,
  RegexScanConfig,
} from "./models/RegexViolation";
export { RegexRule, RegexRuleInfo } from "./models/RegexRule";

// Rules
export { NamingConvention } from "./rules/NamingConvention";
export { HardcodedId } from "./rules/HardcodedId";
export { HardcodedUrl } from "./rules/HardcodedUrl";
export { HardcodedSecret } from "./rules/HardcodedSecret";

// Registry
export { regexRuleRegistry } from "./config/RuleRegistry";

// Scan functions
export {
  scanRegex,
  scanFile,
  getRegexRuleIds,
  hasRegexRule,
} from "./scan";

// Register rules with the registry
// This is done here to avoid circular dependencies
import { regexRuleRegistry } from "./config/RuleRegistry";
import { NamingConvention } from "./rules/NamingConvention";
import { HardcodedId } from "./rules/HardcodedId";
import { HardcodedUrl } from "./rules/HardcodedUrl";
import { HardcodedSecret } from "./rules/HardcodedSecret";

regexRuleRegistry.register("naming-convention", NamingConvention, "NamingConvention");
regexRuleRegistry.register("hardcoded-id", HardcodedId, "HardcodedId");
regexRuleRegistry.register("hardcoded-url", HardcodedUrl, "HardcodedUrl");
regexRuleRegistry.register("hardcoded-secret", HardcodedSecret, "HardcodedSecret");
