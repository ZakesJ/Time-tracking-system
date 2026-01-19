import type { ThemeConfig, ColorValue } from './theme-types';

/**
 * Utility functions for theme management
 */

/**
 * Normalizes a color value to a string
 * Handles both string values and ColorValue objects
 */
function normalizeColor(color: string | ColorValue | undefined): string {
  if (!color) return '';
  if (typeof color === 'string') return color;
  // Prefer oklch format if available, fallback to hex
  return color.oklch || color.hex || color.rgb || color.hsl || '';
}

/**
 * Checks if a value is a CSS variable reference to the same variable
 * e.g., if setting --primary to var(--primary), skip it
 */
function shouldSkipCssVar(varName: string, value: string): boolean {
  if (!value.startsWith('var(')) return false;
  const match = value.match(/var\(--([^)]+)\)/);
  if (!match) return false;
  const referencedVar = match[1];
  // Skip if the value references the same variable (circular reference)
  return varName === referencedVar;
}

/**
 * Applies a theme configuration to the document root
 * Updates all CSS variables based on the theme config
 * Skips CSS variable references that point to themselves (already in globals.css)
 */
export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const { colors, radius } = theme;

  // Apply semantic colors (skip self-references)
  const primaryColor = normalizeColor(colors.primary.color);
  if (!shouldSkipCssVar('primary', primaryColor)) {
    root.style.setProperty('--primary', primaryColor);
  }
  const primaryFg = normalizeColor(colors.primary.foreground);
  if (!shouldSkipCssVar('primary-foreground', primaryFg)) {
    root.style.setProperty('--primary-foreground', primaryFg);
  }
  
  const secondaryColor = normalizeColor(colors.secondary.color);
  if (!shouldSkipCssVar('secondary', secondaryColor)) {
    root.style.setProperty('--secondary', secondaryColor);
  }
  const secondaryFg = normalizeColor(colors.secondary.foreground);
  if (!shouldSkipCssVar('secondary-foreground', secondaryFg)) {
    root.style.setProperty('--secondary-foreground', secondaryFg);
  }
  
  const tertiaryColor = normalizeColor(colors.tertiary.color);
  if (!shouldSkipCssVar('tertiary', tertiaryColor)) {
    root.style.setProperty('--tertiary', tertiaryColor);
  }
  const tertiaryFg = normalizeColor(colors.tertiary.foreground);
  if (!shouldSkipCssVar('tertiary-foreground', tertiaryFg)) {
    root.style.setProperty('--tertiary-foreground', tertiaryFg);
  }
  
  const accentColor = normalizeColor(colors.accent.color);
  if (!shouldSkipCssVar('accent', accentColor)) {
    root.style.setProperty('--accent', accentColor);
  }
  const accentFg = normalizeColor(colors.accent.foreground);
  if (!shouldSkipCssVar('accent-foreground', accentFg)) {
    root.style.setProperty('--accent-foreground', accentFg);
  }
  
  const destructiveColor = normalizeColor(colors.destructive.color);
  if (!shouldSkipCssVar('destructive', destructiveColor)) {
    root.style.setProperty('--destructive', destructiveColor);
  }
  const destructiveFg = normalizeColor(colors.destructive.foreground);
  if (!shouldSkipCssVar('destructive-foreground', destructiveFg)) {
    root.style.setProperty('--destructive-foreground', destructiveFg);
  }
  
  const successColor = normalizeColor(colors.success.color);
  if (!shouldSkipCssVar('success', successColor)) {
    root.style.setProperty('--success', successColor);
  }
  const successFg = normalizeColor(colors.success.foreground);
  if (!shouldSkipCssVar('success-foreground', successFg)) {
    root.style.setProperty('--success-foreground', successFg);
  }
  
  const warningColor = normalizeColor(colors.warning.color);
  if (!shouldSkipCssVar('warning', warningColor)) {
    root.style.setProperty('--warning', warningColor);
  }
  const warningFg = normalizeColor(colors.warning.foreground);
  if (!shouldSkipCssVar('warning-foreground', warningFg)) {
    root.style.setProperty('--warning-foreground', warningFg);
  }
  
  const infoColor = normalizeColor(colors.info.color);
  if (!shouldSkipCssVar('info', infoColor)) {
    root.style.setProperty('--info', infoColor);
  }
  const infoFg = normalizeColor(colors.info.foreground);
  if (!shouldSkipCssVar('info-foreground', infoFg)) {
    root.style.setProperty('--info-foreground', infoFg);
  }
  
  const mutedColor = normalizeColor(colors.muted.color);
  if (!shouldSkipCssVar('muted', mutedColor)) {
    root.style.setProperty('--muted', mutedColor);
  }
  const mutedFg = normalizeColor(colors.muted.foreground);
  if (!shouldSkipCssVar('muted-foreground', mutedFg)) {
    root.style.setProperty('--muted-foreground', mutedFg);
  }
  
  const bgColor = normalizeColor(colors.background.color);
  if (!shouldSkipCssVar('background', bgColor)) {
    root.style.setProperty('--background', bgColor);
  }
  const fgColor = normalizeColor(colors.background.foreground);
  if (!shouldSkipCssVar('foreground', fgColor)) {
    root.style.setProperty('--foreground', fgColor);
  }
  
  const cardColor = normalizeColor(colors.card.color);
  if (!shouldSkipCssVar('card', cardColor)) {
    root.style.setProperty('--card', cardColor);
  }
  const cardFg = normalizeColor(colors.card.foreground);
  if (!shouldSkipCssVar('card-foreground', cardFg)) {
    root.style.setProperty('--card-foreground', cardFg);
  }
  
  const popoverColor = normalizeColor(colors.popover.color);
  if (!shouldSkipCssVar('popover', popoverColor)) {
    root.style.setProperty('--popover', popoverColor);
  }
  const popoverFg = normalizeColor(colors.popover.foreground);
  if (!shouldSkipCssVar('popover-foreground', popoverFg)) {
    root.style.setProperty('--popover-foreground', popoverFg);
  }
  
  const borderColor = normalizeColor(colors.border);
  if (!shouldSkipCssVar('border', borderColor)) {
    root.style.setProperty('--border', borderColor);
  }
  const inputColor = normalizeColor(colors.input);
  if (!shouldSkipCssVar('input', inputColor)) {
    root.style.setProperty('--input', inputColor);
  }
  const ringColor = normalizeColor(colors.ring);
  if (!shouldSkipCssVar('ring', ringColor)) {
    root.style.setProperty('--ring', ringColor);
  }

  // Apply chart colors
  if (colors.chart) {
    const chart1 = normalizeColor(colors.chart[1]);
    if (!shouldSkipCssVar('chart-1', chart1)) {
      root.style.setProperty('--chart-1', chart1);
    }
    const chart2 = normalizeColor(colors.chart[2]);
    if (!shouldSkipCssVar('chart-2', chart2)) {
      root.style.setProperty('--chart-2', chart2);
    }
    const chart3 = normalizeColor(colors.chart[3]);
    if (!shouldSkipCssVar('chart-3', chart3)) {
      root.style.setProperty('--chart-3', chart3);
    }
    const chart4 = normalizeColor(colors.chart[4]);
    if (!shouldSkipCssVar('chart-4', chart4)) {
      root.style.setProperty('--chart-4', chart4);
    }
    const chart5 = normalizeColor(colors.chart[5]);
    if (!shouldSkipCssVar('chart-5', chart5)) {
      root.style.setProperty('--chart-5', chart5);
    }
  }

  // Apply sidebar colors
  if (colors.sidebar) {
    const sidebarBg = normalizeColor(colors.sidebar.background);
    if (!shouldSkipCssVar('sidebar', sidebarBg)) {
      root.style.setProperty('--sidebar', sidebarBg);
    }
    const sidebarFg = normalizeColor(colors.sidebar.foreground);
    if (!shouldSkipCssVar('sidebar-foreground', sidebarFg)) {
      root.style.setProperty('--sidebar-foreground', sidebarFg);
    }
    const sidebarPrimary = normalizeColor(colors.sidebar.primary.color);
    if (!shouldSkipCssVar('sidebar-primary', sidebarPrimary)) {
      root.style.setProperty('--sidebar-primary', sidebarPrimary);
    }
    const sidebarPrimaryFg = normalizeColor(colors.sidebar.primary.foreground);
    if (!shouldSkipCssVar('sidebar-primary-foreground', sidebarPrimaryFg)) {
      root.style.setProperty('--sidebar-primary-foreground', sidebarPrimaryFg);
    }
    const sidebarAccent = normalizeColor(colors.sidebar.accent.color);
    if (!shouldSkipCssVar('sidebar-accent', sidebarAccent)) {
      root.style.setProperty('--sidebar-accent', sidebarAccent);
    }
    const sidebarAccentFg = normalizeColor(colors.sidebar.accent.foreground);
    if (!shouldSkipCssVar('sidebar-accent-foreground', sidebarAccentFg)) {
      root.style.setProperty('--sidebar-accent-foreground', sidebarAccentFg);
    }
    const sidebarBorder = normalizeColor(colors.sidebar.border);
    if (!shouldSkipCssVar('sidebar-border', sidebarBorder)) {
      root.style.setProperty('--sidebar-border', sidebarBorder);
    }
    const sidebarRing = normalizeColor(colors.sidebar.ring);
    if (!shouldSkipCssVar('sidebar-ring', sidebarRing)) {
      root.style.setProperty('--sidebar-ring', sidebarRing);
    }
  }

  // Apply radius values (skip if they're CSS variable references)
  if (radius) {
    if (!shouldSkipCssVar('radius-sm', radius.sm)) {
      root.style.setProperty('--radius-sm', radius.sm);
    }
    if (!shouldSkipCssVar('radius-md', radius.md)) {
      root.style.setProperty('--radius-md', radius.md);
    }
    if (!shouldSkipCssVar('radius-lg', radius.lg)) {
      root.style.setProperty('--radius-lg', radius.lg);
    }
    if (!shouldSkipCssVar('radius-xl', radius.xl)) {
      root.style.setProperty('--radius-xl', radius.xl);
    }
    if (!shouldSkipCssVar('radius-2xl', radius['2xl'])) {
      root.style.setProperty('--radius-2xl', radius['2xl']);
    }
  }

  // Apply color families if provided (skip self-references)
  if (theme.colorFamilies) {
    const families = theme.colorFamilies;
    
    Object.entries(families).forEach(([familyName, shades]) => {
      if (!shades) return;
      Object.entries(shades).forEach(([shade, color]) => {
        const normalizedColor = normalizeColor(color as string | ColorValue);
        const varName = `${familyName}-${shade}`;
        if (!shouldSkipCssVar(varName, normalizedColor)) {
          root.style.setProperty(`--${varName}`, normalizedColor);
        }
      });
    });
  }
}

/**
 * Resets theme to default values
 * Removes all custom CSS variable overrides
 */
export function resetTheme(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const customProperties = [
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--tertiary',
    '--tertiary-foreground',
    '--accent',
    '--accent-foreground',
    '--destructive',
    '--destructive-foreground',
    '--success',
    '--success-foreground',
    '--warning',
    '--warning-foreground',
    '--info',
    '--info-foreground',
    '--muted',
    '--muted-foreground',
    '--background',
    '--foreground',
    '--card',
    '--card-foreground',
    '--popover',
    '--popover-foreground',
    '--border',
    '--input',
    '--ring',
    '--chart-1',
    '--chart-2',
    '--chart-3',
    '--chart-4',
    '--chart-5',
    '--sidebar',
    '--sidebar-foreground',
    '--sidebar-primary',
    '--sidebar-primary-foreground',
    '--sidebar-accent',
    '--sidebar-accent-foreground',
    '--sidebar-border',
    '--sidebar-ring',
  ];

  customProperties.forEach((prop) => {
    root.style.removeProperty(prop);
  });
}

/**
 * Merges a partial theme config with the default theme
 */
export function mergeTheme(
  defaultTheme: ThemeConfig,
  partialTheme: Partial<ThemeConfig>
): ThemeConfig {
  // Helper to merge SemanticColorPair objects
  const mergeColorPair = (
    defaultPair: { color: string | ColorValue; foreground: string | ColorValue },
    partialPair?: { color?: string | ColorValue; foreground?: string | ColorValue }
  ) => {
    if (!partialPair) return defaultPair;
    return {
      color: partialPair.color ?? defaultPair.color,
      foreground: partialPair.foreground ?? defaultPair.foreground,
    };
  };

  return {
    ...defaultTheme,
    ...partialTheme,
    colors: {
      ...defaultTheme.colors,
      // Merge all SemanticColorPair objects properly
      primary: mergeColorPair(defaultTheme.colors.primary, partialTheme.colors?.primary),
      secondary: mergeColorPair(defaultTheme.colors.secondary, partialTheme.colors?.secondary),
      tertiary: mergeColorPair(defaultTheme.colors.tertiary, partialTheme.colors?.tertiary),
      accent: mergeColorPair(defaultTheme.colors.accent, partialTheme.colors?.accent),
      destructive: mergeColorPair(defaultTheme.colors.destructive, partialTheme.colors?.destructive),
      success: mergeColorPair(defaultTheme.colors.success, partialTheme.colors?.success),
      warning: mergeColorPair(defaultTheme.colors.warning, partialTheme.colors?.warning),
      info: mergeColorPair(defaultTheme.colors.info, partialTheme.colors?.info),
      muted: mergeColorPair(defaultTheme.colors.muted, partialTheme.colors?.muted),
      background: mergeColorPair(defaultTheme.colors.background, partialTheme.colors?.background),
      card: mergeColorPair(defaultTheme.colors.card, partialTheme.colors?.card),
      popover: mergeColorPair(defaultTheme.colors.popover, partialTheme.colors?.popover),
      // Merge simple color values
      border: partialTheme.colors?.border ?? defaultTheme.colors.border,
      input: partialTheme.colors?.input ?? defaultTheme.colors.input,
      ring: partialTheme.colors?.ring ?? defaultTheme.colors.ring,
      // Merge chart colors
      chart: partialTheme.colors?.chart
        ? { ...defaultTheme.colors.chart, ...partialTheme.colors.chart }
        : defaultTheme.colors.chart,
      // Merge sidebar colors
      sidebar: partialTheme.colors?.sidebar
        ? {
            ...defaultTheme.colors.sidebar,
            ...partialTheme.colors.sidebar,
            primary: mergeColorPair(
              defaultTheme.colors.sidebar?.primary ?? { color: '', foreground: '' },
              partialTheme.colors.sidebar?.primary
            ),
            accent: mergeColorPair(
              defaultTheme.colors.sidebar?.accent ?? { color: '', foreground: '' },
              partialTheme.colors.sidebar?.accent
            ),
          }
        : defaultTheme.colors.sidebar,
    },
    colorFamilies: {
      ...defaultTheme.colorFamilies,
      ...partialTheme.colorFamilies,
    },
    radius: defaultTheme.radius
      ? {
          ...defaultTheme.radius,
          ...(partialTheme.radius || {}),
        }
      : partialTheme.radius || {
          sm: '4px',
          md: '6px',
          lg: '8px',
          xl: '10px',
          '2xl': '16px',
        },
  };
}

/**
 * Exports theme configuration as JSON string
 */
export function exportTheme(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Imports theme configuration from JSON string
 */
export function importTheme(json: string): ThemeConfig {
  try {
    return JSON.parse(json) as ThemeConfig;
  } catch {
    throw new Error('Invalid theme JSON format');
  }
}

