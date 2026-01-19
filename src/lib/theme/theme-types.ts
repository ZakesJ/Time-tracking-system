/**
 * Theme configuration types
 * Defines the structure for theme customization similar to tweakcn.com
 */

export type ColorFormat = 'oklch' | 'hex' | 'rgb' | 'hsl';

export interface ColorValue {
  /** Color value in oklch format */
  oklch?: string;
  /** Color value in hex format */
  hex?: string;
  /** Color value in rgb format */
  rgb?: string;
  /** Color value in hsl format */
  hsl?: string;
}

export interface SemanticColorPair {
  /** Main color */
  color: string | ColorValue;
  /** Foreground/text color for use on top of main color */
  foreground: string | ColorValue;
}

export interface ColorFamily {
  /** Lightest shade (100) */
  100: string | ColorValue;
  /** Light shade (200) */
  200: string | ColorValue;
  /** Medium-light shade (300) */
  300: string | ColorValue;
  /** Medium shade (400) */
  400: string | ColorValue;
  /** Base shade (500) */
  500: string | ColorValue;
  /** Medium-dark shade (600) */
  600: string | ColorValue;
  /** Dark shade (700) */
  700: string | ColorValue;
  /** Darker shade (800) */
  800: string | ColorValue;
  /** Darkest shade (900) */
  900: string | ColorValue;
}

export interface ThemeColors {
  /** Primary brand color */
  primary: SemanticColorPair;
  /** Secondary brand color */
  secondary: SemanticColorPair;
  /** Tertiary brand color */
  tertiary: SemanticColorPair;
  /** Accent color */
  accent: SemanticColorPair;
  /** Destructive/error color */
  destructive: SemanticColorPair;
  /** Success color */
  success: SemanticColorPair;
  /** Warning color */
  warning: SemanticColorPair;
  /** Info color */
  info: SemanticColorPair;
  /** Muted/subtle color */
  muted: SemanticColorPair;
  /** Background color */
  background: SemanticColorPair;
  /** Card background color */
  card: SemanticColorPair;
  /** Popover background color */
  popover: SemanticColorPair;
  /** Border color */
  border: string | ColorValue;
  /** Input border color */
  input: string | ColorValue;
  /** Focus ring color */
  ring: string | ColorValue;
  /** Chart colors */
  chart?: {
    1: string | ColorValue;
    2: string | ColorValue;
    3: string | ColorValue;
    4: string | ColorValue;
    5: string | ColorValue;
  };
  /** Sidebar colors */
  sidebar?: {
    background: string | ColorValue;
    foreground: string | ColorValue;
    primary: SemanticColorPair;
    accent: SemanticColorPair;
    border: string | ColorValue;
    ring: string | ColorValue;
  };
}

export interface ColorFamilies {
  /** Navy color family */
  navy?: ColorFamily;
  /** Blue color family */
  blue?: ColorFamily;
  /** Cyan color family */
  cyan?: ColorFamily;
  /** Green color family */
  green?: ColorFamily;
  /** Info color family */
  info?: ColorFamily;
  /** Yellow color family */
  yellow?: ColorFamily;
  /** Red color family */
  red?: ColorFamily;
  /** Gray color family */
  gray?: ColorFamily;
}

export interface ThemeConfig {
  /** Theme name */
  name: string;
  /** Theme colors */
  colors: ThemeColors;
  /** Color families for dynamic theming */
  colorFamilies?: ColorFamilies;
  /** Border radius values */
  radius?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export interface ThemeState {
  /** Current theme configuration */
  theme: ThemeConfig;
  /** Whether theme is persisted */
  persisted: boolean;
  /** Last updated timestamp */
  updatedAt: number;
}

