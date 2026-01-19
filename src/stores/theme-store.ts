import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeConfig } from '@/lib/theme/theme-types';
import { defaultTheme } from '@/lib/theme/config';
import { mergeTheme } from '@/lib/theme/theme-utils';

interface ThemeStore {
  theme: ThemeConfig;
  isPersisted: boolean;
  updateTheme: (partialTheme: Partial<ThemeConfig>) => void;
  resetToDefault: (defaultThemeOverride?: ThemeConfig) => void;
  setPersisted: (shouldPersist: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: defaultTheme,
      isPersisted: false,
      
      updateTheme: (partialTheme) => {
        // Check if this is a full theme (has all major properties)
        const isFullTheme = 
          partialTheme.name !== undefined && 
          partialTheme.colors !== undefined &&
          Object.keys(partialTheme.colors).length > 5;
        
        if (isFullTheme) {
          // Full theme update - merge with default to ensure completeness
          const mergedTheme = mergeTheme(defaultTheme, partialTheme);
          set({ theme: mergedTheme });
        } else {
          // Partial update - merge with current theme
          const currentTheme = get().theme;
          const mergedTheme = mergeTheme(currentTheme, partialTheme);
          set({ theme: mergedTheme });
        }
      },
      
      resetToDefault: (defaultThemeOverride) => {
        const baseTheme = defaultThemeOverride || defaultTheme;
        set({ theme: baseTheme });
      },
      
      setPersisted: (shouldPersist) => {
        set({ isPersisted: shouldPersist });
        // If disabling persistence, clear stored theme
        if (!shouldPersist && typeof window !== 'undefined') {
          localStorage.removeItem('theme-storage');
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist theme if isPersisted is true
      partialize: (state) => {
        if (state.isPersisted) {
          return { theme: state.theme, isPersisted: state.isPersisted };
        }
        // Still persist the isPersisted flag, but not the theme
        return { theme: defaultTheme, isPersisted: state.isPersisted };
      },
      // Ensure theme is always merged with default on hydration to include new properties like tertiary
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          // Merge hydrated theme with default to ensure all properties (like tertiary) are present
          const mergedTheme = mergeTheme(defaultTheme, state.theme);
          state.theme = mergedTheme;
        }
      },
    }
  )
);

// Note: Theme application is handled in the ThemeProvider component
// to ensure proper React lifecycle integration

