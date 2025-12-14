/**
 * Icon configuration for flow node types.
 * Emoji are safe in UTF-8 encoded source files and will work in all modern builds.
 * If you need ASCII fallback, use FlowNode.setIconConfig(ASCII_ICONS)
 */

export interface NodeIconConfig {
  [nodeType: string]: {
    [subtype: string]: string;
  } | { default: string };
}

/**
 * Default icons using emoji (recommended for modern environments)
 */
export const DEFAULT_ICONS: NodeIconConfig = {
  actionCalls: {
    apex: '\u2699\uFE0F',           // GEAR (with emoji presentation)
    emailAlert: '\uD83D\uDCE7',     // E-MAIL
    emailSimple: '\uD83D\uDCE7',    // E-MAIL
    submit: '\u26A1',               // HIGH VOLTAGE
    default: '\u26A1'               // HIGH VOLTAGE
  },
  assignments: { 
    default: '\uD83D\uDFF0'         // 🟰 HEAVY EQUALS SIGN
  },
  collectionProcessors: {
    FilterCollectionProcessor: '\uD83D\uDD3D',  // DOWN BUTTON
    SortCollectionProcessor: '\uD83D\uDD03',    // CLOCKWISE ARROWS
    default: '\uD83D\uDCE6'         // PACKAGE
  },
  customErrors: { 
    default: '\uD83D\uDEAB'         // PROHIBITED
  },
  decisions: { 
    default: '\uD83D\uDD00'         // TWISTED ARROWS
  },
  loops: { 
    default: '\uD83D\uDD01'         // REPEAT BUTTON
  },
  recordCreates: { 
    default: '\u2795'               // PLUS
  },
  recordDeletes: { 
    default: '\uD83D\uDDD1\uFE0F'   // WASTEBASKET
  },
  recordLookups: { 
    default: '\uD83D\uDD0D'         // MAGNIFYING GLASS
  },
  recordUpdates: { 
    default: '\uD83D\uDEE0\uFE0F'   // HAMMER AND WRENCH
  },
  screens: { 
    default: '\uD83D\uDCBB'         // LAPTOP
  },
  subflows: { 
    default: '\uD83D\uDD17'         // LINK
  },
  transforms: { 
    default: '\u267B\uFE0F'
  },
};

/**
 * ASCII fallback icons (for environments without emoji support)
 */
export const ASCII_ICONS: NodeIconConfig = {
  actionCalls: {
    apex: '[A]',
    emailAlert: '[E]',
    emailSimple: '[E]',
    submit: '[!]',
    default: '[!]'
  },
  assignments: { default: '[=]' },
  collectionProcessors: {
    FilterCollectionProcessor: '[F]',
    SortCollectionProcessor: '[S]',
    default: '[C]'
  },
  customErrors: { default: '[X]' },
  decisions: { default: '[?]' },
  loops: { default: '[L]' },
  recordCreates: { default: '[+]' },
  recordDeletes: { default: '[-]' },
  recordLookups: { default: '[S]' },
  recordUpdates: { default: '[U]' },
  screens: { default: '[#]' },
  subflows: { default: '[>]' },
  transforms: { default: '[T]' },
};

/**
 * Get default icon config (can be overridden at runtime)
 */
export function getDefaultIconConfig(): NodeIconConfig {
  return DEFAULT_ICONS;
}