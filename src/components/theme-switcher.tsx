
"use client";

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { THEMES, THEME_DISPLAY_NAMES, ThemePreference, ThemeClassName } from '@/lib/constants';
import { Moon, Sun, Trees, Ghost } from 'lucide-react'; // Added Ghost, removed Paintbrush if no longer needed

export function ThemeSwitcher() {
  const { themePreference, setThemePreference, resolvedTheme } = useTheme();

  // Ensure themeIcons correctly maps all ThemeClassNames from THEMES
  const themeIcons: Record<Exclude<ThemeClassName, 'system'> | 'system-placeholder', React.ReactNode> = {
    [THEMES.LIGHT]: <Sun className="h-4 w-4" />,
    [THEMES.DARK]: <Moon className="h-4 w-4" />,
    [THEMES.FOREST]: <Trees className="h-4 w-4" />,
    [THEMES.DRACULA]: <Ghost className="h-4 w-4" />, // Changed to Ghost icon
    'system-placeholder': <Sun className="h-4 w-4" />, // Placeholder for system preference
  };

  const currentIconToDisplay = themePreference === 'system'
    ? (resolvedTheme === THEMES.DARK ? themeIcons[THEMES.DARK] : themeIcons[THEMES.LIGHT])
    : themeIcons[resolvedTheme as Exclude<ThemeClassName, 'system'>];

  // Make sure availablePreferences uses the keys from THEMES directly for selectable themes
  const availablePreferences = Object.values(THEMES).filter(
    theme => theme !== 'light' && theme !== 'dark' && theme !== 'theme-forest' && theme !== 'theme-dracula'
      ? false // Exclude any unexpected values not in our defined THEMES constants
      : true
  ) as ThemeClassName[];


  // Explicitly list selectable preferences without 'system'
  const selectablePreferences: ThemeClassName[] = [THEMES.LIGHT, THEMES.DARK, THEMES.FOREST, THEMES.DRACULA];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          {currentIconToDisplay}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {selectablePreferences.map((preferenceKey) => (
          <DropdownMenuItem
            key={preferenceKey}
            onClick={() => setThemePreference(preferenceKey)}
            className={themePreference === preferenceKey ? "bg-accent text-accent-foreground focus:bg-accent focus:text-accent-foreground" : ""}
          >
            <div className="flex items-center gap-2">
              {themeIcons[preferenceKey as Exclude<ThemeClassName, 'system'>]}
              <span>{THEME_DISPLAY_NAMES[preferenceKey]}</span>
            </div>
          </DropdownMenuItem>
        ))}
        {/* Removed the "System" DropdownMenuItem */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
