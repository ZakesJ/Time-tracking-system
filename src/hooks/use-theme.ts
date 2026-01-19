import { useThemeContext } from '@/providers/theme-provider';
import type { ThemeConfig } from '@/lib/theme/theme-types';

/**
 * Hook for accessing and updating theme
 * 
 * @example
 * ```tsx
 * const { theme, updateTheme, resetToDefault } = useTheme();
 * 
 * // Update primary color
 * updateTheme({
 *   colors: {
 *     primary: {
 *       color: 'oklch(0.5 0.2 250)',
 *       foreground: 'oklch(0.95 0 0)'
 *     }
 *   }
 * });
 * ```
 */
export function useTheme() {
  const context = useThemeContext();
  
  return {
    /** Current theme configuration */
    theme: context.theme,
    /** Update theme with partial configuration */
    updateTheme: context.updateTheme,
    /** Reset theme to default values */
    resetToDefault: context.resetToDefault,
    /** Whether theme is persisted to localStorage */
    isPersisted: context.isPersisted,
    /** Enable/disable theme persistence */
    persistTheme: context.persistTheme,
  };
}

/**
 * Hook for accessing specific theme colors
 * Useful for components that need direct access to theme values
 */
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

/**
 * Hook for accessing theme color families
 */
export function useThemeColorFamilies() {
  const { theme } = useTheme();
  return theme.colorFamilies || {};
}

export type { ThemeConfig };

