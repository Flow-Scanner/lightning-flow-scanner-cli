/**
 * Icon configuration for flow variable types.
 * Includes icons for variable subtypes and boolean states.
 */

export interface VariableIconConfig {
  // Variable subtype icons
  subtypes: {
    [subtype: string]: string;
  };
  // Boolean state icons (for isCollection, isInput, isOutput)
  boolean: {
    true: string;
    false: string;
  };
}

/**
 * Default icons using emoji (recommended for modern environments)
 */
export const DEFAULT_VARIABLE_ICONS: VariableIconConfig = {
  subtypes: {
    variables: '\uD83D\uDCCA',        // BAR CHART (data/variable)
    constants: '\uD83D\uDD12',        // LOCK (constant/immutable)
    formulas: '\uD83E\uDDEE',         // ABACUS (calculation)
    choices: '\uD83D\uDCCB',          // CLIPBOARD (picklist/choices)
    dynamicChoiceSets: '\uD83D\uDD04', // ARROWS (dynamic)
  },
  boolean: {
    true: '\u2705',                   // CHECK MARK
    false: '\u2B1C',                  // WHITE SQUARE
  }
};

/**
 * ASCII fallback icons (for environments without emoji support)
 */
export const ASCII_VARIABLE_ICONS: VariableIconConfig = {
  subtypes: {
    variables: '[V]',
    constants: '[C]',
    formulas: '[F]',
    choices: '[CH]',
    dynamicChoiceSets: '[D]',
  },
  boolean: {
    true: '[X]',
    false: '[ ]',
  }
};

/**
 * Get default variable icon config
 */
export function getDefaultVariableIconConfig(): VariableIconConfig {
  return DEFAULT_VARIABLE_ICONS;
}