import { IExceptions } from "./IExceptions";
import { IRuleOptions } from "./IRuleOptions";

export enum DetailLevel {
  ENRICHED = 'enriched',
  SIMPLE = 'simple'
}

export interface IRulesConfig {
  betaMode?: boolean;  // Toggles beta rules; defaults to false
  betamode?: boolean;  // Use betaMode instead; to be removed
  systemRules?: boolean; // Toggles system rules (category: 'system'); defaults to true
  detailLevel?: 'enriched' | 'simple' | DetailLevel;
  exceptions?: IExceptions;
  rules?: IRuleOptions;
  ruleMode?: "merged" | "isolated"; // Defaults to "merged"
  ignoreFlows?: string[]; // Flow API names to exclude from scanning
}