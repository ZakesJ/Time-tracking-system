import type { ThemeConfig } from './theme-types';

/**
 * Default theme configuration
 * All values reference CSS variables defined in globals.css
 * Update colors in globals.css to change them everywhere
 */
export const defaultTheme: ThemeConfig = {
  name: 'default',
  colors: {
    primary: {
      color: 'var(--primary)',
      foreground: 'var(--primary-foreground)',
    },
    secondary: {
      color: 'var(--secondary)',
      foreground: 'var(--secondary-foreground)',
    },
    tertiary: {
      color: 'var(--tertiary)',
      foreground: 'var(--tertiary-foreground)',
    },
    accent: {
      color: 'var(--accent)',
      foreground: 'var(--accent-foreground)',
    },
    destructive: {
      color: 'var(--destructive)',
      foreground: 'var(--destructive-foreground)',
    },
    success: {
      color: 'var(--success)',
      foreground: 'var(--success-foreground)',
    },
    warning: {
      color: 'var(--warning)',
      foreground: 'var(--warning-foreground)',
    },
    info: {
      color: 'var(--info)',
      foreground: 'var(--info-foreground)',
    },
    muted: {
      color: 'var(--muted)',
      foreground: 'var(--muted-foreground)',
    },
    background: {
      color: 'var(--background)',
      foreground: 'var(--foreground)',
    },
    card: {
      color: 'var(--card)',
      foreground: 'var(--card-foreground)',
    },
    popover: {
      color: 'var(--popover)',
      foreground: 'var(--popover-foreground)',
    },
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
    chart: {
      1: 'var(--chart-1)',
      2: 'var(--chart-2)',
      3: 'var(--chart-3)',
      4: 'var(--chart-4)',
      5: 'var(--chart-5)',
    },
    sidebar: {
      background: 'var(--sidebar)',
      foreground: 'var(--sidebar-foreground)',
      primary: {
        color: 'var(--sidebar-primary)',
        foreground: 'var(--sidebar-primary-foreground)',
      },
      accent: {
        color: 'var(--sidebar-accent)',
        foreground: 'var(--sidebar-accent-foreground)',
      },
      border: 'var(--sidebar-border)',
      ring: 'var(--sidebar-ring)',
    },
  },
  colorFamilies: {
    navy: {
      100: 'var(--navy-100)',
      200: 'var(--navy-200)',
      300: 'var(--navy-300)',
      400: 'var(--navy-400)',
      500: 'var(--navy-500)',
      600: 'var(--navy-600)',
      700: 'var(--navy-700)',
      800: 'var(--navy-800)',
      900: 'var(--navy-900)',
    },
    blue: {
      100: 'var(--blue-100)',
      200: 'var(--blue-200)',
      300: 'var(--blue-300)',
      400: 'var(--blue-400)',
      500: 'var(--blue-500)',
      600: 'var(--blue-600)',
      700: 'var(--blue-700)',
      800: 'var(--blue-800)',
      900: 'var(--blue-900)',
    },
    cyan: {
      100: 'var(--cyan-100)',
      200: 'var(--cyan-200)',
      300: 'var(--cyan-300)',
      400: 'var(--cyan-400)',
      500: 'var(--cyan-500)',
      600: 'var(--cyan-600)',
      700: 'var(--cyan-700)',
      800: 'var(--cyan-800)',
      900: 'var(--cyan-900)',
    },
    green: {
      100: 'var(--green-100)',
      200: 'var(--green-200)',
      300: 'var(--green-300)',
      400: 'var(--green-400)',
      500: 'var(--green-500)',
      600: 'var(--green-600)',
      700: 'var(--green-700)',
      800: 'var(--green-800)',
      900: 'var(--green-900)',
    },
    info: {
      100: 'var(--info-100)',
      200: 'var(--info-200)',
      300: 'var(--info-300)',
      400: 'var(--info-400)',
      500: 'var(--info-500)',
      600: 'var(--info-600)',
      700: 'var(--info-700)',
      800: 'var(--info-800)',
      900: 'var(--info-900)',
    },
    yellow: {
      100: 'var(--yellow-100)',
      200: 'var(--yellow-200)',
      300: 'var(--yellow-300)',
      400: 'var(--yellow-400)',
      500: 'var(--yellow-500)',
      600: 'var(--yellow-600)',
      700: 'var(--yellow-700)',
      800: 'var(--yellow-800)',
      900: 'var(--yellow-900)',
    },
    red: {
      100: 'var(--red-100)',
      200: 'var(--red-200)',
      300: 'var(--red-300)',
      400: 'var(--red-400)',
      500: 'var(--red-500)',
      600: 'var(--red-600)',
      700: 'var(--red-700)',
      800: 'var(--red-800)',
      900: 'var(--red-900)',
    },
    gray: {
      100: 'var(--gray-100)',
      200: 'var(--gray-200)',
      300: 'var(--gray-300)',
      400: 'var(--gray-400)',
      500: 'var(--gray-500)',
      600: 'var(--gray-600)',
      700: 'var(--gray-700)',
      800: 'var(--gray-800)',
      900: 'var(--gray-900)',
    },
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
  },
};

