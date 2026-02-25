import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, SemanticColors } from '../tokens/colors';
import { textStyles, fontSizes, fontWeights, lineHeights, letterSpacings } from '../tokens/typography';
import { spacing, space, radii, iconSizes } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: SemanticColors;
  textStyles: typeof textStyles;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  letterSpacings: typeof letterSpacings;
  spacing: typeof spacing;
  space: typeof space;
  radii: typeof radii;
  iconSizes: typeof iconSizes;
  shadows: typeof shadows;
  isDark: boolean;
  mode: ThemeMode;
}

interface ThemeContextValue extends Theme {
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const isDark = useMemo(() => {
    if (mode === 'system') return systemScheme === 'dark';
    return mode === 'dark';
  }, [mode, systemScheme]);

  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  const theme = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      textStyles,
      fontSizes,
      fontWeights,
      lineHeights,
      letterSpacings,
      spacing,
      space,
      radii,
      iconSizes,
      shadows,
      isDark,
      mode,
      setMode: handleSetMode,
    }),
    [isDark, mode, handleSetMode],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
