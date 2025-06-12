
export const THEMES = {
  LIGHT: 'light', // Represents the default theme (no class explicitly added for light)
  DARK: 'dark',
  FOREST: 'theme-forest',
  DRACULA: 'theme-dracula',
} as const;

// ThemeName includes 'system' for user preference, but not as a class name
export type ThemeClassName = typeof THEMES[keyof typeof THEMES];
export type ThemePreference = ThemeClassName | 'system';

export const THEME_DISPLAY_NAMES: Record<ThemePreference, string> = {
  [THEMES.LIGHT]: 'Light',
  [THEMES.DARK]: 'Dark',
  [THEMES.FOREST]: 'Forest',
  [THEMES.DRACULA]: 'Dracula',
  system: 'System',
};

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';
export const STORAGE_KEY = 'sauceboss-theme';
