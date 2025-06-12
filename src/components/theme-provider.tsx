
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { THEMES, ThemePreference, DEFAULT_THEME_PREFERENCE, STORAGE_KEY, ThemeClassName } from '@/lib/constants';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
  storageKey?: string;
}

interface ThemeProviderState {
  themePreference: ThemePreference; // User's selected preference ('light', 'dark', 'system')
  setThemePreference: (theme: ThemePreference) => void;
  resolvedTheme: ThemeClassName; // Actual theme applied ('light', 'dark', etc.)
}

const initialState: ThemeProviderState = {
  themePreference: DEFAULT_THEME_PREFERENCE,
  setThemePreference: () => null,
  resolvedTheme: THEMES.LIGHT, // Default resolved theme before hydration
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME_PREFERENCE,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(DEFAULT_THEME_PREFERENCE);
  const [resolvedTheme, setResolvedThemeState] = useState<ThemeClassName>(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((themeToApply: ThemeClassName) => {
    const root = window.document.documentElement;
    console.log(`[ThemeProvider] Attempting to apply theme: ${themeToApply}`);
    console.log('[ThemeProvider] Current HTML classList BEFORE changes:', root.classList.toString());

    // Define all known theme classes that might need to be removed
    const allThemeClasses: ThemeClassName[] = [THEMES.DARK, THEMES.FOREST, THEMES.DRACULA];

    allThemeClasses.forEach(cls => {
      if (cls && root.classList.contains(cls)) { // Ensure cls is not undefined
        console.log(`[ThemeProvider] Removing class: ${cls}`);
        root.classList.remove(cls);
      }
    });

    // Add the new theme class, but only if it's not the 'light' theme (which implies no class)
    if (themeToApply !== THEMES.LIGHT) {
      console.log(`[ThemeProvider] Adding class: ${themeToApply}`);
      root.classList.add(themeToApply);
    }

    setResolvedThemeState(themeToApply);
    console.log('[ThemeProvider] Current HTML classList AFTER changes:', root.classList.toString());
    console.log('[ThemeProvider] Resolved theme state set to:', themeToApply);
  }, [setResolvedThemeState]);


  useEffect(() => {
    setMounted(true);
    let initialPreference: ThemePreference;
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as ThemePreference | null;
      if (storedTheme === 'system' || Object.values(THEMES).includes(storedTheme as ThemeClassName)) {
        initialPreference = storedTheme;
      } else {
        initialPreference = defaultTheme;
      }
    } catch (e) {
      initialPreference = defaultTheme;
      console.error('[ThemeProvider] Failed to read theme from localStorage', e);
    }
    setThemePreferenceState(initialPreference);
    console.log('[ThemeProvider] Initial theme preference (from storage or default):', initialPreference);


    if (initialPreference === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
      console.log('[ThemeProvider] System preference detected. Applying theme:', systemTheme);
      applyTheme(systemTheme);
    } else {
      // This handles 'light', 'dark', 'theme-forest', 'theme-dracula' directly from storage
      if (initialPreference !== 'system') { // Ensure it's a direct theme name
         console.log('[ThemeProvider] Direct theme preference detected. Applying theme:', initialPreference);
        applyTheme(initialPreference as ThemeClassName); // Cast is safe here due to prior checks
      } else {
        // Fallback if initialPreference somehow still 'system' but shouldn't be here
        console.warn('[ThemeProvider] Fallback: Applying light theme as default.')
        applyTheme(THEMES.LIGHT);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTheme, storageKey]);


  useEffect(() => {
    if (!mounted) return;
    console.log('[ThemeProvider] themePreference or mounted changed. Current preference:', themePreference);

    if (themePreference === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
      console.log('[ThemeProvider] System preference update. Applying theme:', systemTheme);
      applyTheme(systemTheme);
    } else {
      // This handles 'light', 'dark', 'theme-forest', 'theme-dracula'
      console.log('[ThemeProvider] Direct theme preference update. Applying theme:', themePreference);
      applyTheme(themePreference as ThemeClassName); // Cast is safe here
    }
  }, [themePreference, applyTheme, mounted]);

  useEffect(() => {
    if (!mounted || themePreference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      console.log('[ThemeProvider] System dark mode preference changed via media query.');
      const newSystemTheme = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
      applyTheme(newSystemTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference, applyTheme, mounted]);

  const setThemePreference = (newPreference: ThemePreference) => {
    if (!mounted) return;
    console.log('[ThemeProvider] setThemePreference called with:', newPreference);
    try {
      window.localStorage.setItem(storageKey, newPreference);
    } catch (e) {
      console.error('[ThemeProvider] Failed to save theme to localStorage', e);
    }
    setThemePreferenceState(newPreference);
  };

  const value = {
    themePreference,
    setThemePreference,
    resolvedTheme: mounted ? resolvedTheme : THEMES.LIGHT, // Avoid hydration mismatch for resolvedTheme
  };


  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
