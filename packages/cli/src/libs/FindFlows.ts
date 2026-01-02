import * as glob from 'glob';
import { loadIgnorePatterns } from './LoadIgnorePatterns.js';

export function FindFlows(dir: string, configIgnore?: string[]): string[] {
  // Normalize Windows paths → POSIX (required for glob)
  dir = dir.replace(/\\/g, "/");
  const ignorePatterns = loadIgnorePatterns(dir, configIgnore);

  return glob.sync(dir + '/**/*.{flow-meta.xml,flow}', {
    ignore: ignorePatterns
  });
}
