// scannerconfig.ts
import { cosmiconfig } from "cosmiconfig";
import * as os from "os";

export interface ScannerOptions {
  rules?: Record<string, any>;
  exceptions?: Record<string, any>;
  betaMode?: boolean;
  ignore?: string[];
  ignoreFlows?: string[];
  categories?: string[];
  threshold?: string;
  [key: string]: any;
}

export async function loadScannerOptions(
  forcedConfigFile?: string,
  cliOverrides: Partial<ScannerOptions> = {},
  searchFrom?: string
): Promise<ScannerOptions> {
  const moduleName = "flow-scanner";
  const searchPlaces = [
    "package.json",
    `.${moduleName}.yaml`,
    `.${moduleName}.yml`,
    `.${moduleName}.json`,
    `config/.${moduleName}.yaml`,
    `config/.${moduleName}.yml`,
    `.flow-scanner`,
  ];

  const explorer = cosmiconfig(moduleName, {
    searchPlaces,
    stopDir: os.homedir() // Search up to home directory, not stopping at package boundaries
  });
  const result = forcedConfigFile
    ? await explorer.load(forcedConfigFile)
    : await explorer.search(searchFrom);

  const fileConfig: ScannerOptions = result?.config ?? {};

  return {
    ...fileConfig,
    ...cliOverrides,
    betaMode: cliOverrides.betaMode ?? fileConfig.betaMode ?? false,
  };
}