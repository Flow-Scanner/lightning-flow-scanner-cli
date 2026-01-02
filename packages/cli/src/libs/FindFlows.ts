import * as glob from 'glob';
import { loadIgnorePatterns } from './LoadIgnorePatterns.js';

export function FindFlows(dir: string, configIgnore?: string[]): string[] {
  // Normalize Windows paths → POSIX (required for glob)
  dir = dir.replace(/\\/g, "/");
  const ignorePatterns = loadIgnorePatterns(dir, configIgnore);

  // Use cwd instead of absolute path in pattern to make ignore work correctly
  return glob.sync('**/*.{flow-meta.xml,flow}', {
    cwd: dir,
    ignore: ignorePatterns,
    absolute: true
  });
}
