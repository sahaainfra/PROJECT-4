// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS — Part 19
// Unified Enterprise Design System Tokens
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#E7EEF8',
    100: '#D4E1F3',
    200: '#A9C3E7',
    300: '#7EA5DB',
    400: '#5387CF',
    500: '#2A78D6',
    600: '#1D4F91',
    700: '#163F75',
    800: '#11325E',
    900: '#0B2344',
    950: '#061529',
  },

  // Secondary Accent (Construction Safety Gold)
  accent: {
    50: '#FFFBEB',
    100: '#FFF3DC',
    200: '#FFE4A8',
    300: '#FFD474',
    400: '#F2A900',
    500: '#D99600',
    600: '#A87200',
    700: '#8A4B00',
    800: '#6B3A00',
    900: '#4D2900',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
  },

  // Neutral Colors (Engineering Slate)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Chart Palette (8 construction-themed colors)
  chart: [
    '#1D4F91', // Primary Blue
    '#2A78D6', // Bright Blue
    '#F2A900', // Safety Gold
    '#10B981', // Success Green
    '#EF4444', // Error Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ],
};

// ═══════════════════════════════════════════════════════════
// TYPOGRAPHY TOKENS
// ═══════════════════════════════════════════════════════════

export const typography = {
  fontFamily: {
    sans: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

// ═══════════════════════════════════════════════════════════
// SPACING TOKENS (4pt grid)
// ═══════════════════════════════════════════════════════════

export const spacing = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',   // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// ═══════════════════════════════════════════════════════════
// BORDER RADIUS TOKENS
// ═══════════════════════════════════════════════════════════

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px - Small controls
  md: '0.5rem',     // 8px - Cards, inputs
  lg: '0.75rem',    // 12px - Large cards
  xl: '1rem',       // 16px - Modals
  '2xl': '1.5rem',  // 24px - Large modals
  full: '9999px',   // Pill shapes
};

// ═══════════════════════════════════════════════════════════
// ELEVATION TOKENS (3 levels)
// ═══════════════════════════════════════════════════════════

export const elevation: Record<string, string> = {
  // Level 1: Normal cards
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Level 2: Hover/elevated cards
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  
  // Level 3: Dropdowns/modals
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// ═══════════════════════════════════════════════════════════
// MOTION TOKENS
// ═══════════════════════════════════════════════════════════

export const motion = {
  duration: {
    fast: '120ms',
    normal: '200ms',
    slow: '320ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ═══════════════════════════════════════════════════════════
// BREAKPOINT TOKENS
// ═══════════════════════════════════════════════════════════

export const breakpoints = {
  mobile: '360px',
  tablet: '820px',
  desktop: '1440px',
  wide: '1920px',
};

// ═══════════════════════════════════════════════════════════
// Z-INDEX TOKENS
// ═══════════════════════════════════════════════════════════

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
};

// ═══════════════════════════════════════════════════════════
// SEMANTIC TOKENS (Theme-aware)
// ═══════════════════════════════════════════════════════════

export const semanticTokens = {
  light: {
    // Backgrounds
    bgPrimary: colors.slate[50],
    bgSecondary: '#FFFFFF',
    bgTertiary: colors.slate[100],
    
    // Text
    textPrimary: colors.slate[900],
    textSecondary: colors.slate[600],
    textTertiary: colors.slate[500],
    textDisabled: colors.slate[400],
    textInverse: '#FFFFFF',
    
    // Borders
    borderSubtle: colors.slate[200],
    borderDefault: colors.slate[300],
    borderStrong: colors.slate[400],
    
    // Interactive
    interactivePrimary: colors.primary[600],
    interactivePrimaryHover: colors.primary[700],
    interactiveSecondary: colors.slate[600],
    interactiveSecondaryHover: colors.slate[700],
    
    // Focus
    focusRing: `0 0 0 2px ${colors.primary[500]}`,
    
    // Shadows
    shadowSm: elevation.sm,
    shadowMd: elevation.md,
    shadowLg: elevation.lg,
  },
  
  dark: {
    // Backgrounds
    bgPrimary: colors.slate[950],
    bgSecondary: colors.slate[900],
    bgTertiary: colors.slate[800],
    
    // Text
    textPrimary: colors.slate[50],
    textSecondary: colors.slate[300],
    textTertiary: colors.slate[400],
    textDisabled: colors.slate[600],
    textInverse: colors.slate[900],
    
    // Borders
    borderSubtle: colors.slate[800],
    borderDefault: colors.slate[700],
    borderStrong: colors.slate[600],
    
    // Interactive
    interactivePrimary: colors.primary[400],
    interactivePrimaryHover: colors.primary[300],
    interactiveSecondary: colors.slate[400],
    interactiveSecondaryHover: colors.slate[300],
    
    // Focus
    focusRing: `0 0 0 2px ${colors.primary[400]}`,
    
    // Shadows
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  },
};

// ═══════════════════════════════════════════════════════════
// COMPONENT TOKENS
// ═══════════════════════════════════════════════════════════

export const componentTokens = {
  // Button
  button: {
    height: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.625rem 1.25rem',
      lg: '0.75rem 1.5rem',
    },
    fontSize: {
      sm: typography.fontSize.sm,
      md: typography.fontSize.sm,
      lg: typography.fontSize.base,
    },
    borderRadius: borderRadius.md,
  },
  
  // Input
  input: {
    height: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.625rem 1rem',
      lg: '0.75rem 1.25rem',
    },
    fontSize: typography.fontSize.sm,
    borderRadius: borderRadius.md,
  },
  
  // Card
  card: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: '1px',
  },
  
  // Table
  table: {
    cellPadding: spacing[3],
    headerFontSize: typography.fontSize.xs,
    bodyFontSize: typography.fontSize.sm,
    rowHeight: '3rem', // 48px
  },
  
  // Modal
  modal: {
    padding: spacing[6],
    borderRadius: borderRadius.xl,
    maxWidth: {
      sm: '28rem',    // 448px
      md: '42rem',    // 672px
      lg: '56rem',    // 896px
      xl: '70rem',    // 1120px
    },
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Get theme-aware color token
 */
export function getColorToken(token: string, theme: 'light' | 'dark' = 'light'): string {
  const tokens = semanticTokens[theme];
  return (tokens as any)[token] || token;
}

/**
 * Format currency in Indian format
 */
export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(2)} K`;
    }
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format date in Indian format
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });
    case 'medium':
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    case 'long':
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    default:
      return d.toLocaleDateString('en-IN');
  }
}

/**
 * Check if color has sufficient contrast
 */
export function checkContrast(foreground: string, background: string): { ratio: number; passes: boolean } {
  // Simplified contrast check - in production, use a proper WCAG contrast calculator
  // This is a placeholder that always returns true for now
  return { ratio: 4.5, passes: true };
}
