import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

const DEFAULT_IGNORE = ['**/node_modules/**'];
const IGNORE_FILE_NAME = '.flowscanignore';

/**
 * Load ignore patterns from config and .flowscanignore file
 * @param baseDir - Base directory to search for .flowscanignore
 * @param configIgnore - Optional ignore patterns from config
 * @returns Merged array of ignore patterns
 */
export function loadIgnorePatterns(
  baseDir: string,
  configIgnore?: string[]
): string[] {
  const patterns: string[] = [...DEFAULT_IGNORE];

  // Add patterns from config
  if (Array.isArray(configIgnore) && configIgnore.length > 0) {
    patterns.push(...configIgnore);
  }

  // Read .flowscanignore file
  const ignoreFilePath = path.join(baseDir, IGNORE_FILE_NAME);
  if (existsSync(ignoreFilePath)) {
    try {
      const content = readFileSync(ignoreFilePath, 'utf8');
      const filePatterns = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));

      patterns.push(...filePatterns);
    } catch (error: any) {
      console.warn(`Warning: Could not read ${IGNORE_FILE_NAME}: ${error.message}`);
    }
  }

  return patterns;
}
