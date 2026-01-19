"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';
import type { ThemeConfig } from '@/lib/theme/theme-types';
import { applyTheme, resetTheme } from '@/lib/theme/theme-utils';

interface ThemeContextValue {
  theme: ThemeConfig;
  updateTheme: (partialTheme: Partial<ThemeConfig>) => void;
  resetToDefault: () => void;
  isPersisted: boolean;
  persistTheme: (shouldPersist: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeOverride?: ThemeConfig;
  persist?: boolean;
}

export function ThemeProvider({
  children,
  defaultThemeOverride,
  persist = false,
}: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const isPersisted = useThemeStore((state) => state.isPersisted);
  const updateTheme = useThemeStore((state) => state.updateTheme);
  const resetToDefault = useThemeStore((state) => state.resetToDefault);
  const setPersisted = useThemeStore((state) => state.setPersisted);

  // Initialize with default theme override if provided
  useEffect(() => {
    if (defaultThemeOverride) {
      useThemeStore.getState().resetToDefault(defaultThemeOverride);
    }
  }, [defaultThemeOverride]);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Set persisted state on mount
  useEffect(() => {
    if (persist !== isPersisted) {
      setPersisted(persist);
    }
  }, [persist, isPersisted, setPersisted]);

  const handleResetToDefault = () => {
    resetTheme(); // Clear any custom CSS overrides
    resetToDefault(defaultThemeOverride);
  };

  const handlePersistTheme = (shouldPersist: boolean) => {
    setPersisted(shouldPersist);
  };

  const value: ThemeContextValue = {
    theme,
    updateTheme,
    resetToDefault: handleResetToDefault,
    isPersisted,
    persistTheme: handlePersistTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

