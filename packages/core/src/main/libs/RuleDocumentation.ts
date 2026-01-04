/**
 * Converts a rule label to a documentation URL anchor.
 *
 * Rules:
 * - Lowercase
 * - Spaces → hyphens
 * - Remove special characters and badges
 *
 * @param label - The rule display label (e.g., "DML Statement In A Loop")
 * @returns The anchor slug (e.g., "dml-statement-in-a-loop")
 */
export function labelToAnchor(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric except hyphens
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
}

/**
 * Generates a documentation URL for a rule.
 *
 * @param label - The rule display label
 * @param customUrl - Optional custom URL override
 * @returns The documentation URL
 */
export function getRuleDocumentationUrl(label: string, customUrl?: string): string {
  if (customUrl) {
    return customUrl;
  }

  const anchor = labelToAnchor(label);
  return `https://flow-scanner.github.io/lightning-flow-scanner/#${anchor}`;
}
