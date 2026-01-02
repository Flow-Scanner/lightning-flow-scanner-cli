import * as vscode from 'vscode';

/**
 * Utility class for detecting VS Code theme and determining appropriate CSS files
 *
 * This helper centralizes theme detection logic used by webview panels
 * to dynamically load theme-appropriate CSS files.
 *
 * @example
 * // Get current theme status
 * const isDark = ThemeHelper.isDarkTheme();
 *
 * // Get appropriate tabulator CSS filename
 * const cssFile = ThemeHelper.getTabulatorCssFilename();
 */
export class ThemeHelper {
  /**
   * Determines if the current theme is dark-based
   * Returns true for Dark and HighContrast themes
   * Returns false for Light and HighContrastLight themes
   */
  public static isDarkTheme(): boolean {
    const themeKind = vscode.window.activeColorTheme.kind;
    return (
      themeKind === vscode.ColorThemeKind.Dark ||
      themeKind === vscode.ColorThemeKind.HighContrast
    );
  }

  /**
   * Gets the appropriate tabulator CSS filename based on current theme
   */
  public static getTabulatorCssFilename(): string {
    return this.isDarkTheme() ? 'tabulator-midnight.css' : 'tabulator.css';
  }
}
