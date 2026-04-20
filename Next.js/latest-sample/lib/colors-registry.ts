/**
 * Sample Admin Dashboard - Comprehensive Color Registry
 * 
 * This file documents all colors used throughout the website,
 * organized by category and usage patterns.
 */

// ============================================================================
// PRIMARY BRANDING COLORS
// ============================================================================

export const PRIMARY_COLORS = {
  // Primary Gradient (Cyan to Blue)
  CYAN: '#00F5C6',           // Primary accent - vibrant cyan
  BLUE: '#00AEEF',           // Secondary primary - bright blue
  DARK_BLUE: '#0066CC',      // Darker shade for depth

  // Gradient Combinations
  GRADIENT_LIGHT: 'from-[#00F5C6] to-[#00AEEF]',  // Cyan → Blue (most used)
  GRADIENT_DARK: 'from-[#00AEEF] to-[#0066CC]',   // Blue → Dark Blue
};

// ============================================================================
// BACKGROUND COLORS
// ============================================================================

export const BACKGROUND_COLORS = {
  // Main dark background (HSL: 222° 47% 11%)
  DARK_BG: '#0A0F1C',           // Primary background
  DARK_BG_HSL: '222 47% 11%',   // HSL equivalent
  
  // Glass morphism backgrounds
  GLASS_BASE: 'rgba(255, 255, 255, 0.04)',      // Subtle white overlay
  GLASS_HOVER: 'rgba(255, 255, 255, 0.05)',     // Slightly more opaque
  
  // Overlay colors for depth
  OVERLAY_20: 'rgba(255, 255, 255, 0.20)',      // 20% white overlay
  OVERLAY_5: 'rgba(255, 255, 255, 0.05)',       // 5% white overlay
};

// ============================================================================
// TEXT & FOREGROUND COLORS
// ============================================================================

export const TEXT_COLORS = {
  // Primary text (HSL: 210° 40% 98%)
  WHITE: '#FFFFFF',                  // Pure white for primary text
  WHITE_HSL: '210 40% 98%',          // HSL equivalent
  
  // Secondary text (HSL: 217° 10% 60%)
  SECONDARY: '#B0B6C1',              // Muted gray text
  SECONDARY_HSL: '217 10% 60%',      // HSL equivalent
  
  // Additional text shades
  MUTED: 'hsl(215 20.2% 65.1%)',     // Even more muted
};

// ============================================================================
// BORDER & STROKE COLORS
// ============================================================================

export const BORDER_COLORS = {
  // Standard borders (white with opacity)
  DEFAULT: 'border-white/10',        // Default border - 10% white
  HOVER: 'border-white/15',          // Hover state - 15% white
  FOCUS: 'border-white/20',          // Focus state - 20% white
  LIGHT: 'border-white/5',           // Light border - 5% white
  
  // Accent borders
  CYAN_ACCENT: 'border-[#00F5C6]/50',      // Cyan border with 50% opacity
  CYAN_LIGHT: 'border-[#00F5C6]/30',       // Cyan border - 30% opacity
  CYAN_FOCUS: 'border-[#00F5C6]/20',       // Cyan border - 20% opacity
  BLUE_ACCENT: 'border-[#00AEEF]/50',      // Blue border - 50% opacity
  BLUE_LIGHT: 'border-[#00AEEF]/30',       // Blue border - 30% opacity
  
  // Actual hex values
  WHITE_10: 'rgba(255, 255, 255, 0.10)',   // 10% white
  WHITE_5: 'rgba(255, 255, 255, 0.05)',    // 5% white
};

// ============================================================================
// BUTTON COLORS
// ============================================================================

export const BUTTON_COLORS = {
  // Primary Button (White border)
  PRIMARY: {
    background: 'border border-white/10 text-white hover:bg-white/5',
    hex: 'transparent',
    border: 'white/10',
    text: 'white',
  },
  
  // Secondary Button (Cyan to Blue gradient)
  SECONDARY: {
    background: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90',
    gradient: 'from-[#00F5C6] to-[#00AEEF]',
    text: '#0A0F1C',
  },
  
  // Ghost Button
  GHOST: {
    background: 'text-[#B0B6C1] hover:text-white hover:bg-white/5',
    text: '#B0B6C1',
    textHover: 'white',
    bgHover: 'white/5',
  },
  
  // Outline Button
  OUTLINE: {
    background: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90',
    gradient: 'from-[#00F5C6] to-[#00AEEF]',
    text: '#0A0F1C',
  },
};

// ============================================================================
// GRADIENT & EFFECT COLORS
// ============================================================================

export const GRADIENT_COLORS = {
  // Icon backgrounds
  ICON_CYAN_BLUE: 'bg-gradient-to-br from-[#00F5C6] to-[#00AEEF]',
  ICON_BLUE_DARK: 'bg-gradient-to-br from-[#00AEEF] to-[#0066CC]',
  ICON_PURPLE: 'bg-gradient-to-br from-[#9333EA] to-[#6B21A8]',
  ICON_GREEN: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
  
  // Card hover effects
  HOVER_OVERLAY: 'from-[#00F5C6]/20 to-[#00AEEF]/20',      // 20% opacity
  HOVER_BLUR: 'from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl',
  
  // Progress bars
  PROGRESS_BAR: 'from-[#00F5C6] to-[#00AEEF]',
  PROGRESS_BG: '[#00F5C6]/20',                              // Background for progress
  
  // Selection highlights
  SELECT_BG: 'from-[#00F5C6]/20 to-[#00AEEF]/20',
  SELECT_BORDER: '[#00F5C6]',
};

// ============================================================================
// STATUS & SEMANTIC COLORS
// ============================================================================

export const STATUS_COLORS = {
  // Success (Green)
  SUCCESS: {
    bg: '#10B981',
    gradient: 'from-[#10B981] to-[#059669]',
    light: '#10B981/20',
    text: '#10B981',
  },
  
  // Warning (Orange)
  WARNING: {
    bg: '#F59E0B',
    light: '#F59E0B/20',
    text: '#F59E0B',
  },
  
  // Error (Red)
  ERROR: {
    bg: '#EF4444',
    light: '#EF4444/20',
    text: '#EF4444',
  },
  
  // Info (Blue)
  INFO: {
    bg: '#00AEEF',
    light: '#00AEEF/20',
    text: '#00AEEF',
    border: 'border-[#00AEEF]/50',
  },
  
  // Pending (Purple/Orange)
  PENDING: {
    bg: '#F59E0B',
    light: '#F59E0B/20',
    text: '#F59E0B',
  },
  
  // Active (Cyan)
  ACTIVE: {
    bg: '#00F5C6',
    light: '#00F5C6/20',
    text: '#00F5C6',
    border: 'border-[#00F5C6]/50',
  },
};

// ============================================================================
// BADGE & LABEL COLORS
// ============================================================================

export const BADGE_COLORS = {
  // Cyan badges
  CYAN_BADGE: {
    border: 'border-[#00F5C6]/50',
    text: 'text-[#00F5C6]',
    bg: 'bg-[#00F5C6]/10',
  },
  
  // Blue badges
  BLUE_BADGE: {
    bg: 'bg-[#00AEEF]/20',
    text: 'text-[#00AEEF]',
    border: 'border-[#00AEEF]/30',
  },
  
  // Gradient badges
  GRADIENT_BADGE: {
    bg: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]',
    text: 'text-[#0A0F1C]',
  },
  
  // Muted badges
  MUTED_BADGE: {
    bg: 'bg-white/10',
    text: 'text-[#B0B6C1]',
    border: 'border-white/10',
  },
};

// ============================================================================
// INTERACTIVE ELEMENT COLORS
// ============================================================================

export const INTERACTIVE_COLORS = {
  // Tab states
  ACTIVE_TAB: {
    border: 'border-[#00F5C6]',
    text: 'text-[#00F5C6]',
  },
  INACTIVE_TAB: {
    text: 'text-[#B0B6C1]',
  },
  
  // Toggle switches
  TOGGLE_ON: 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]',
  TOGGLE_OFF: 'bg-white/20',
  
  // Input fields
  INPUT_BG: 'bg-white/5',
  INPUT_BORDER: 'border-white/10',
  INPUT_FOCUS: 'focus:border-[#00F5C6]',
  INPUT_FOCUS_RING: 'focus:ring-[#00F5C6]/20 focus:ring-[3px]',
  INPUT_PLACEHOLDER: 'placeholder:text-[#B0B6C1]',
};

// ============================================================================
// SPECIAL & UTILITY COLORS
// ============================================================================

export const SPECIAL_COLORS = {
  // Floating/Ghost effects
  GHOST_OVERLAY: 'rgba(255, 255, 255, 0.02)',
  SHADOW_SUBTLE: 'rgba(0, 0, 0, 0.3)',
  
  // Link colors
  LINK_DEFAULT: '#00F5C6',
  LINK_HOVER: '#00F5C6/80',
  
  // Disabled state
  DISABLED_TEXT: 'text-[#B0B6C1]/50',
  DISABLED_BG: 'bg-white/5',
};

// ============================================================================
// COLOR USAGE GUIDE
// ============================================================================

/**
 * QUICK REFERENCE BY COMPONENT TYPE:
 * 
 * BUTTONS:
 *   - Primary Action: BUTTON_COLORS.PRIMARY
 *   - Call-to-Action: BUTTON_COLORS.SECONDARY (gradient)
 *   - Ghost/Secondary: BUTTON_COLORS.GHOST
 * 
 * TEXT:
 *   - Main content: TEXT_COLORS.WHITE
 *   - Secondary/Muted: TEXT_COLORS.SECONDARY
 *   - Disabled: SPECIAL_COLORS.DISABLED_TEXT
 * 
 * BACKGROUNDS:
 *   - Page background: BACKGROUND_COLORS.DARK_BG
 *   - Card background: BACKGROUND_COLORS.GLASS_BASE
 *   - Hover effects: BACKGROUND_COLORS.GLASS_HOVER
 * 
 * BORDERS:
 *   - Default: BORDER_COLORS.DEFAULT (white/10)
 *   - Accent: BORDER_COLORS.CYAN_ACCENT
 *   - Focus: BORDER_COLORS.FOCUS (white/20)
 * 
 * GRADIENTS:
 *   - Primary gradient: PRIMARY_COLORS.GRADIENT_LIGHT
 *   - Alternative: PRIMARY_COLORS.GRADIENT_DARK
 *   - Icon backgrounds: GRADIENT_COLORS.ICON_*
 * 
 * STATUS:
 *   - Success: STATUS_COLORS.SUCCESS
 *   - Error: STATUS_COLORS.ERROR
 *   - Warning: STATUS_COLORS.WARNING
 * 
 * BADGES:
 *   - Active/Accent: BADGE_COLORS.CYAN_BADGE
 *   - Subtle: BADGE_COLORS.MUTED_BADGE
 *   - Highlighted: BADGE_COLORS.GRADIENT_BADGE
 */

// ============================================================================
// HEX COLOR LOOKUP TABLE
// ============================================================================

export const HEX_COLORS = {
  // Primary
  '#00F5C6': 'Cyan (Primary Accent)',
  '#00AEEF': 'Blue (Primary Secondary)',
  '#0066CC': 'Dark Blue (Secondary)',
  
  // Background
  '#0A0F1C': 'Dark Background',
  
  // Text
  '#FFFFFF': 'White Text',
  '#B0B6C1': 'Muted Gray Text',
  
  // Semantic
  '#10B981': 'Green (Success)',
  '#059669': 'Dark Green (Success)',
  '#F59E0B': 'Amber (Warning)',
  '#EF4444': 'Red (Error)',
  '#9333EA': 'Purple',
  '#6B21A8': 'Dark Purple',
};

// ============================================================================
// OPACITY SCALE REFERENCE
// ============================================================================

export const OPACITY_SCALE = {
  'white/5': '5% opacity (rgba(255, 255, 255, 0.05))',
  'white/10': '10% opacity (rgba(255, 255, 255, 0.10))',
  'white/15': '15% opacity (rgba(255, 255, 255, 0.15))',
  'white/20': '20% opacity (rgba(255, 255, 255, 0.20))',
  
  'opacity-80': '80% opacity',
  'opacity-90': '90% opacity',
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE: Button Styling
 * 
 * Primary Button:
 * className="border border-white/10 text-white hover:bg-white/5"
 * 
 * Secondary Button (CTA):
 * className="bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
 * 
 * Ghost Button:
 * className="text-[#B0B6C1] hover:text-white hover:bg-white/5"
 */

/**
 * EXAMPLE: Card Styling
 * 
 * className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all"
 */

/**
 * EXAMPLE: Text Styling
 * 
 * Primary text:
 * className="text-white"
 * 
 * Secondary text:
 * className="text-[#B0B6C1]"
 */

/**
 * EXAMPLE: Icon with Gradient Background
 * 
 * className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center"
 */
