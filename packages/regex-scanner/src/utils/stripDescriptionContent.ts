/**
 * Strips description content from strings to avoid false positives in rule scanning.
 * Description tags in Flow elements often contain documentation URLs and IDs
 * that should not trigger hardcoded-id or hardcoded-url violations.
 *
 * Handles both formats:
 * - XML: <description>...</description>
 * - JSON: "description":"..."
 */
export function stripDescriptionContent(content: string): string {
  // Remove XML-style description tags (handles multiline content)
  let result = content.replace(/<description>[\s\S]*?<\/description>/gi, "");

  // Remove JSON-style description properties
  // Matches "description":"value" with proper JSON string escaping
  result = result.replace(/"description"\s*:\s*"(?:[^"\\]|\\.)*"/g, "");

  return result;
}
