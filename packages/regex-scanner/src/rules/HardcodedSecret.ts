import { MetadataFile } from "../models/MetadataFile";
import { RegexRule } from "../models/RegexRule";
import { RegexViolation, RegexRuleConfig } from "../models/RegexViolation";

/**
 * Secret pattern definition with regex and description
 */
interface SecretPattern {
  name: string;
  pattern: RegExp;
  description: string;
}

/**
 * Detects hardcoded secrets and API keys in metadata files.
 * Includes patterns for Stripe, AWS, Salesforce, and other common secrets.
 */
export class HardcodedSecret extends RegexRule {
  /**
   * Collection of secret patterns to detect
   */
  public static readonly SECRET_PATTERNS: SecretPattern[] = [
    // Azure
    {
      name: "Azure Storage Account Key",
      pattern: /AccountKey=[A-Za-z0-9+/]{88}==/g,
      description: "Azure Storage account key detected",
    },
    {
      name: "Azure Connection String",
      pattern: /DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+/g,
      description: "Azure connection string detected",
    },
    // GCP Service Account Key
    {
      name: "GCP Service Account Key",
      pattern: /"type"\s*:\s*"service_account"[\s\S]{0,500}"private_key"/g,
      description: "GCP service account JSON key detected",
    },
    // Stripe
    {
      name: "Stripe API Key",
      pattern: /(sk|pk|rk)_(test|live)_[0-9a-zA-Z]{24,}/g,
      description: "Stripe API key detected",
    },
    // AWS
    {
      name: "AWS Access Key ID",
      pattern: /\bAKIA[0-9A-Z]{16}\b/g,
      description: "AWS access key ID detected",
    },
    {
      name: "AWS Secret Access Key",
      pattern: /aws[_-]?secret[_-]?access[_-]?key\s*[:=]\s*["'][A-Za-z0-9/+=]{40}["']/gi,
      description: "AWS secret access key detected",
    },
    // Salesforce
    {
      name: "Salesforce Session ID",
      pattern: /\b00D[a-zA-Z0-9]{15}![a-zA-Z0-9.]{80,}/g,
      description: "Salesforce session ID detected",
    },
    {
      name: "Salesforce Refresh Token",
      pattern: /\b5Aep[a-zA-Z0-9._]{80,}/g,
      description: "Salesforce refresh token detected",
    },
    {
      name: "Hardcoded OAuth Token",
      pattern: /(authorization|auth)\s*[:=]\s*["']Bearer\s+[A-Za-z0-9\-_\.]{20,}["']/gi,
      description: "Hardcoded OAuth bearer token detected",
    },
    // Generic API Keys and Tokens
    {
      name: "Bearer Token",
      pattern: /Bearer\s+[a-zA-Z0-9_\-.]{20,}/gi,
      description: "Bearer token detected",
    },
    {
      name: "Basic Auth",
      pattern: /Basic\s+[a-zA-Z0-9+/=]{20,}/gi,
      description: "Basic authentication credentials detected",
    },
    // Private Keys
    {
      name: "Private Key",
      pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g,
      description: "Private key detected",
    },
    {
      name: "Certificate",
      pattern: /-----BEGIN\s+CERTIFICATE-----/g,
      description: "Certificate detected",
    },
    {
      name: "JWT Secret",
      pattern: /jwt[_-]?secret\s*[:=]\s*["'][^"']{8,}["']/gi,
      description: "Hardcoded JWT secret detected",
    },
    // GitHub
    {
      name: "GitHub Token",
      pattern: /gh[puo]_[A-Za-z0-9_]{36,}/g,
      description: "GitHub token detected",
    },
    // Slack
    {
      name: "Slack Token",
      pattern: /xox[baprs]-[a-zA-Z0-9-]{10,}/g,
      description: "Slack token detected",
    },
    {
      name: "Slack Webhook",
      pattern: /hooks\.slack\.com\/services\/[A-Z0-9]{9,}\/[A-Z0-9]{9,}\/[A-Za-z0-9]{20,}/g,
      description: "Slack webhook URL detected",
    },
    // Google
    {
      name: "Google API Key",
      pattern: /AIza[0-9A-Za-z_-]{35}/g,
      description: "Google API key detected",
    },
    // Twilio
    {
      name: "Twilio API Key",
      pattern: /SK[a-fA-F0-9]{32}/g,
      description: "Twilio API key detected",
    },
    // SendGrid
    {
      name: "SendGrid API Key",
      pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
      description: "SendGrid API key detected",
    },
    // Mailchimp
    {
      name: "Mailchimp API Key",
      pattern: /[a-f0-9]{32}-us[0-9]{1,2}/g,
      description: "Mailchimp API key detected",
    },
    // Generic password patterns
    {
      name: "Password Assignment",
      pattern: /(password|passwd|pwd|secret)\s*[:=]\s*["'][^"'\s]{8,}["']/gi,
      description: "Hardcoded password or secret assignment detected",
    },
    // AI API Keys
    {
      name: "OpenAI API Key",
      pattern: /sk-[A-Za-z0-9]{48,}/g,
      description: "OpenAI API key detected",
    },
    {
      name: "Anthropic API Key",
      pattern: /sk-ant-[A-Za-z0-9_-]{20,}/g,
      description: "Anthropic API key detected",
    }
  ];

  constructor() {
    super({
      ruleId: "hardcoded-secret",
      name: "HardcodedSecret",
      label: "Hardcoded Secret",
      description:
        "Avoid hardcoding secrets, API keys, tokens, or credentials in metadata files. These should be stored securely in Named Credentials, Custom Settings, Custom Metadata, or external secret management systems.",
      summary: "Hardcoded secrets pose security risks",
      severity: "error",
      supportedTypes: ["*"],
      docRefs: [
        {
          label: "Salesforce Named Credentials",
          path: "https://help.salesforce.com/s/articleView?id=sf.named_credentials_about.htm",
        },
        {
          label: "OWASP Secrets Management",
          path: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
        },
      ],
      isConfigurable: false,
    });
  }

  protected check(
    file: MetadataFile,
    _config?: RegexRuleConfig
  ): RegexViolation[] {
    const violations: RegexViolation[] = [];

    // If elements are provided, search each element
    if (file.elements && file.elements.length > 0) {
      for (const element of file.elements) {
        const content =
          typeof element.content === "string"
            ? element.content
            : JSON.stringify(element.content);

        const matches = this.findSecrets(content);
        for (const match of matches) {
          violations.push(
            this.createViolation(file, {
              name: element.name,
              type: element.type,
              metaType: "element",
              matchedText: this.maskSecret(match.matchedText),
              message: match.description,
            })
          );
        }
      }
    } else {
      // Fall back to searching raw content
      const matches = this.findSecrets(file.content);
      for (const match of matches) {
        violations.push(
          this.createViolation(file, {
            name: file.name,
            type: "content",
            metaType: "content",
            matchedText: this.maskSecret(match.matchedText),
            message: match.description,
          })
        );
      }
    }

    return violations;
  }

  /**
   * Find all secrets in content using all patterns
   */
  private findSecrets(
    content: string
  ): Array<{ matchedText: string; description: string }> {
    const results: Array<{ matchedText: string; description: string }> = [];
    const seen = new Set<string>(); // Deduplicate matches

    for (const secretPattern of HardcodedSecret.SECRET_PATTERNS) {
      // Create fresh regex for each search (reset lastIndex)
      const regex = new RegExp(
        secretPattern.pattern.source,
        secretPattern.pattern.flags
      );
      const matches = content.match(regex);

      if (matches) {
        for (const match of matches) {
          if (!seen.has(match)) {
            seen.add(match);
            results.push({
              matchedText: match,
              description: secretPattern.description,
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Mask sensitive parts of the secret for display
   * Shows first 4 and last 4 characters only
   */
  private maskSecret(secret: string): string {
    if (secret.length <= 12) {
      return secret.substring(0, 4) + "****";
    }
    return secret.substring(0, 4) + "****" + secret.substring(secret.length - 4);
  }
}
