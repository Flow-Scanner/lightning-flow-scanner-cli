# Security Policy for Lightning Flow Scanner

## Security Practices

- Code is open-source and peer-reviewed by the community.
- Vulnerabilities can be reported privately via GitHub security features.
- Changes to the repository are scanned and reviewed before merging.
- Tokenless Publishing with scoped npm packages and releases via GitHub Actions Trusted Publishing (OIDC).

## Reporting a Vulnerability

If you discover a security vulnerability, please report it using [GitHub vulnerability reporting](https://github.com/Flow-Scanner/lightning-flow-scanner-core/security).

## Data Handling

This tool collects zero user data. No credentials, PII, payment info, health data, or user content is ever stored, transmitted, or shared. All analysis runs 100% client-side with no network calls to external services.

We temporarily use metadata (e.g., Flow metadata, timestamps) in-memory only for real-time functionality during your session. This data is never stored, logged, or transmitted and is discarded immediately when the session ends.

## Dependencies

We actively track and maintain an up-to-date inventory of all third-party dependencies to ensure security and compatibility. Our dependencies include:

| Package           | License                                                                           | Purpose                                        |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------------------------- |
| `fast-xml-parser` | [MIT](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/LICENSE) | Validate XML, Parse XML and Build XML rapidly. |
