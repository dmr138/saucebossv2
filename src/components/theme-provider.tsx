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
    // Remove all known theme classes first
    const allThemeClasses: ThemeClassName[] = [THEMES.DARK, THEMES.FOREST, THEMES.DRACULA];
    allThemeClasses.forEach(cls => {
      if (cls && root.classList.contains(cls)) {
        root.classList.remove(cls);
      }
    });
    // Add new theme class except if it's light (which uses no class)
    if (themeToApply !== THEMES.LIGHT) {
      root.classList.add(themeToApply);
    }
    setResolvedThemeState(themeToApply);
  }, []);

  useEffect(() => {
    setMounted(true);
    let initialPreference: ThemePreference;

    try {
      const storedTheme = window.localStorage.getItem(storageKey);
      const validThemes = [...Object.values(THEMES), 'system'];
      if (storedTheme && validThemes.includes(storedTheme)) {
        initialPreference = storedTheme as ThemePreference;
      } else {
        initialPreference = defaultTheme;
      }
    } catch (e) {
      initialPreference = defaultTheme;
      console.error('[ThemeProvider] Failed to read theme from localStorage', e);
    }

    setThemePreferenceState(initialPreference);

    if (initialPreference === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
      applyTheme(systemTheme);
    } else {
      applyTheme(initialPreference as ThemeClassName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) return;

    if (themePreference === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
      applyTheme(systemTheme);
    } else {
      applyTheme(themePreference as ThemeClassName);
    }
  }, [themePreference, applyTheme, mounted]);

  useEffect(() => {
    if (!mounted || themePreference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
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
    resolvedTheme: mounted ? resolvedTheme : THEMES.LIGHT,
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
