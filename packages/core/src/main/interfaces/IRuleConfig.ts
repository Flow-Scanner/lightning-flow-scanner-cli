export interface IRuleConfig {
  enabled?: boolean;
  severity?: "error" | "warning" | "note";
  message?: string; // Custom message to override rule description
  messageUrl?: string; // Custom URL for documentation (auto-generated if not provided)
}