/**
 * Color Constants - Sample Admin Dashboard
 * 
 * These constants define all colors used in the application.
 * Use these values directly in styles, Tailwind classes, and inline styles.
 * 
 * NOTE: Tailwind arbitrary values (e.g., bg-[#00F5C6]) cannot use template literals.
 * Use the hex values directly in className strings.
 */

// ============================================================================
// PRIMARY BRANDING COLORS
// ============================================================================

export const PRIMARY = {
  cyan: '#00F5C6',      // Primary accent color
  blue: '#00AEEF',      // Secondary primary color
  darkBlue: '#0066CC',  // Dark blue for depth
} as const;

// ============================================================================
// BACKGROUND COLORS
// ============================================================================

export const BACKGROUND = {
  dark: '#0A0F1C',      // Main dark background
  glass: 'rgba(255, 255, 255, 0.04)',  // Glass effect background
  glassHover: 'rgba(255, 255, 255, 0.05)',
  overlay5: 'rgba(255, 255, 255, 0.05)',
  overlay20: 'rgba(255, 255, 255, 0.20)',
} as const;

// ============================================================================
// TEXT COLORS
// ============================================================================

export const TEXT = {
  primary: '#FFFFFF',       // Main text (white)
  secondary: '#B0B6C1',     // Muted gray text
  muted: '#999999',         // Even more muted
} as const;

// ============================================================================
// BORDER COLORS
// ============================================================================

export const BORDER = {
  light: 'rgba(255, 255, 255, 0.05)',    // white/5
  default: 'rgba(255, 255, 255, 0.10)',  // white/10
  hover: 'rgba(255, 255, 255, 0.15)',    // white/15
  focus: 'rgba(255, 255, 255, 0.20)',    // white/20
} as const;

// ============================================================================
// STATUS & SEMANTIC COLORS
// ============================================================================

export const STATUS = {
  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#00AEEF',
  pending: '#F59E0B',
  active: '#00F5C6',
  inactive: '#B0B6C1',
} as const;

// ============================================================================
// GRADIENT VALUES (For style props, not Tailwind classes)
// ============================================================================

export const GRADIENTS = {
  primary: `linear-gradient(to right, ${PRIMARY.cyan}, ${PRIMARY.blue})`,
  primaryDark: `linear-gradient(to right, ${PRIMARY.blue}, ${PRIMARY.darkBlue})`,
  primaryBR: `linear-gradient(to bottom right, ${PRIMARY.cyan}, ${PRIMARY.blue})`,
} as const;

// ============================================================================
// OPACITY VALUES
// ============================================================================

export const OPACITY = {
  5: 0.05,
  10: 0.1,
  15: 0.15,
  20: 0.2,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  80: 0.8,
  90: 0.9,
} as const;

// ============================================================================
// TAILWIND CLASS STRINGS (Pre-built for components)
// ============================================================================

export const TAILWIND_CLASSES = {
  // Button styles
  buttons: {
    primary: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-white font-medium',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    outline: 'border border-[#00F5C6] text-[#00F5C6] hover:bg-[#00F5C6] hover:text-black',
    ghost: 'text-white hover:bg-white/10',
  },
  
  // Card styles
  cards: {
    glass: 'bg-white/5 backdrop-blur-sm border border-white/10',
    glassHover: 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10',
  },
  
  // Text styles
  text: {
    primary: 'text-white',
    secondary: 'text-gray-400',
    muted: 'text-gray-500',
    accent: 'text-[#00F5C6]',
  },
  
  // Border styles
  borders: {
    light: 'border-white/5',
    default: 'border-white/10',
    hover: 'border-white/20',
    focus: 'border-[#00F5C6]',
  },
  
  // Status styles
  status: {
    success: 'text-green-400 border',
    warning: 'text-yellow-400 border',
    error: 'text-red-400 border',
    info: 'text-blue-400 border',
    pending: 'text-yellow-400 border',
    active: 'text-[#00F5C6] border',
    inactive: 'text-gray-400 border',
  },
  
  // Input styles
  input: {
    base: 'w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white',
    focus: 'focus:outline-none focus:ring-2 focus:ring-[#00F5C6] focus:border-transparent',
    placeholder: 'placeholder-gray-400',
  },
  
  // Icon background styles
  iconBg: {
    primary: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]',
    alternative: 'bg-white/20',
    secondary: 'bg-white/10',
    success: 'bg-green-500/20',
    warning: 'bg-yellow-500/20',
    error: 'bg-red-500/20',
  },
  
  // Progress bar styles
  progress: {
    bg: 'bg-white/10',
    bar: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]',
  },
} as const;

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Get CSS variable value from DOM (for runtime access to CSS custom properties)
 */
export const getCSSVariable = (varName: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName);
  }
  return '';
};

/**
 * Get button class based on variant
 */
export const getButtonClass = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary'): string => {
  return TAILWIND_CLASSES.buttons[variant];
};

/**
 * Get card class based on variant  
 */
export const getCardClass = (variant: 'glass' | 'glassHover' = 'glass'): string => {
  return TAILWIND_CLASSES.cards[variant];
};

/**
 * Get status color
 */
export const getStatusColor = (status: keyof typeof STATUS): string => {
  return STATUS[status];
};

/**
 * Apply opacity to any color
 */
export const withOpacity = (color: string, opacity: keyof typeof OPACITY): string => {
  // For hex colors, convert to rgba
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${OPACITY[opacity]})`;
  }
  
  // For rgba colors, replace the alpha value
  if (color.includes('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${OPACITY[opacity]})`);
  }
  
  // For rgb colors, convert to rgba
  if (color.includes('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${OPACITY[opacity]})`);
  }
  
  return color;
};

export const COLORS = {
  PRIMARY,
  BACKGROUND,
  TEXT,
  BORDER,
  STATUS,
  GRADIENTS,
  OPACITY,
  TAILWIND_CLASSES,
} as const;

export default COLORS;
