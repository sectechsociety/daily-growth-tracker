import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const cssVariableMap = {
  background: '--app-background',
  surface: '--surface-background',
  surfaceSoft: '--surface-soft',
  surfaceStrong: '--surface-strong',
  cardBg: '--card-background',
  glassBackground: '--glass-background',
  glassBorder: '--glass-border-color',
  glassShadow: '--glass-shadow',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  border: '--border-color',
  shadow: '--shadow-strength',
  primary: '--color-primary',
  secondary: '--color-secondary',
  tertiary: '--color-tertiary',
  white: '--color-white',
  muted: '--color-muted',
  accent: '--accent-color',
  accentSecondary: '--accent-secondary-color',
  accentSoft: '--accent-soft-color',
  levelAccent: '--level-accent',
  levelAccentSoft: '--level-accent-soft',
  totalAccent: '--total-accent',
  totalAccentSoft: '--total-accent-soft',
  todayAccent: '--today-accent',
  todayAccentSoft: '--today-accent-soft',
  todayAccentAlert: '--today-accent-alert',
  todayAccentAlertSoft: '--today-accent-alert-soft',
  success: '--success-color',
  warning: '--warning-color',
  error: '--error-color',
  navBg: '--nav-background',
};

const themePresets = {
  light: {
    name: 'Light',
    values: {
      background: 'linear-gradient(135deg, #f0e6ff 0%, #e0d9ff 100%)',
      surface: 'rgba(255, 255, 255, 0.62)',
      surfaceSoft: 'rgba(255, 255, 255, 0.28)',
      surfaceStrong: 'rgba(255, 255, 255, 0.72)',
      cardBg: 'rgba(255, 255, 255, 0.72)',
      glassBackground: 'linear-gradient(150deg, rgba(255,255,255,0.58) 0%, rgba(240,233,255,0.28) 100%)',
      glassBorder: 'rgba(255, 255, 255, 0.32)',
      glassShadow: '0 18px 38px rgba(109, 40, 217, 0.12)',
      textPrimary: '#1f2937',
      textSecondary: 'rgba(55, 65, 81, 0.72)',
      border: 'rgba(255, 255, 255, 0.32)',
      shadow: 'rgba(109, 40, 217, 0.18)',
      primary: '#E8D5F2',
      secondary: '#D4F1F4',
      tertiary: '#FFE5E5',
      white: '#FFFFFF',
      muted: 'rgba(148, 163, 184, 0.28)',
      accent: '#7c3aed',
      accentSecondary: '#a78bfa',
      accentSoft: 'rgba(124, 58, 237, 0.16)',
      levelAccent: '#6D28D9',
      levelAccentSoft: 'rgba(109, 40, 217, 0.18)',
      totalAccent: '#2563EB',
      totalAccentSoft: 'rgba(37, 99, 235, 0.18)',
      todayAccent: '#0EA5E9',
      todayAccentSoft: 'rgba(14, 165, 233, 0.18)',
      todayAccentAlert: '#DC2626',
      todayAccentAlertSoft: 'rgba(220, 38, 38, 0.22)',
      success: '#16a34a',
      warning: '#f59e0b',
      error: '#ef4444',
      navBg: 'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(235,233,255,0.32) 100%)',
    },
  },
  dark: {
    name: 'Dark',
    values: {
      background: 'radial-gradient(120% 120% at 20% 20%, #1f2937 0%, #0f172a 50%, #111827 100%)',
      surface: 'rgba(15, 23, 42, 0.65)',
      surfaceSoft: 'rgba(148, 163, 184, 0.12)',
      surfaceStrong: 'rgba(15, 23, 42, 0.78)',
      cardBg: 'rgba(30, 41, 59, 0.7)',
      glassBackground: 'linear-gradient(150deg, rgba(15, 23, 42, 0.72) 0%, rgba(30, 41, 59, 0.55) 100%)',
      glassBorder: 'rgba(129, 140, 248, 0.28)',
      glassShadow: '0 24px 48px rgba(2, 6, 23, 0.55)',
      textPrimary: '#e2e8f0',
      textSecondary: 'rgba(148, 163, 184, 0.85)',
      border: 'rgba(148, 163, 184, 0.25)',
      shadow: 'rgba(2, 6, 23, 0.6)',
      primary: '#312e81',
      secondary: '#1e1b4b',
      tertiary: '#4c1d95',
      white: '#f8fafc',
      muted: 'rgba(148, 163, 184, 0.18)',
      accent: '#a78bfa',
      accentSecondary: '#6366f1',
      accentSoft: 'rgba(129, 140, 248, 0.24)',
      levelAccent: '#C4B5FD',
      levelAccentSoft: 'rgba(129, 140, 248, 0.28)',
      totalAccent: '#60A5FA',
      totalAccentSoft: 'rgba(96, 165, 250, 0.28)',
      todayAccent: '#34D399',
      todayAccentSoft: 'rgba(52, 211, 153, 0.28)',
      todayAccentAlert: '#F87171',
      todayAccentAlertSoft: 'rgba(248, 113, 113, 0.3)',
      success: '#22c55e',
      warning: '#fbbf24',
      error: '#f87171',
      navBg: 'linear-gradient(160deg, rgba(30, 41, 59, 0.85) 0%, rgba(17, 24, 39, 0.68) 100%)',
    },
  },
};

const defaultCustom = {
  background: themePresets.light.values.background,
  cardBg: themePresets.light.values.cardBg,
  textPrimary: themePresets.light.values.textPrimary,
  textSecondary: themePresets.light.values.textSecondary,
  accent: themePresets.light.values.accent,
  accentSecondary: themePresets.light.values.accentSecondary,
  primary: themePresets.light.values.primary,
  secondary: themePresets.light.values.secondary,
  tertiary: themePresets.light.values.tertiary,
  white: themePresets.light.values.white,
  muted: themePresets.light.values.muted,
};

const getInitialThemeName = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const stored = window.localStorage.getItem('appTheme');
  if (stored && (stored in themePresets || stored === 'custom')) {
    return stored;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialCustomColors = () => {
  if (typeof window === 'undefined') {
    return defaultCustom;
  }
  const stored = window.localStorage.getItem('customThemeColors');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...defaultCustom, ...parsed };
    } catch (error) {
      console.error('Failed to parse stored custom theme colors:', error);
    }
  }
  return defaultCustom;
};

const buildCustomPalette = (customColors) => ({
  name: 'Custom',
  values: {
    ...themePresets.light.values,
    ...customColors,
    surface: 'rgba(255, 255, 255, 0.62)',
    surfaceSoft: 'rgba(255, 255, 255, 0.26)',
    surfaceStrong: customColors.cardBg || themePresets.light.values.cardBg,
    glassBackground: customColors.cardBg || themePresets.light.values.glassBackground,
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    glassShadow: '0 18px 38px rgba(15, 23, 42, 0.16)',
    border: 'rgba(255, 255, 255, 0.3)',
    shadow: 'rgba(124, 58, 237, 0.18)',
    accentSoft: 'rgba(124, 58, 237, 0.16)',
    levelAccent: customColors.accent || themePresets.light.values.levelAccent,
    levelAccentSoft: 'rgba(124, 58, 237, 0.2)',
    totalAccent: customColors.accentSecondary || themePresets.light.values.totalAccent,
    totalAccentSoft: 'rgba(37, 99, 235, 0.18)',
    todayAccent: '#0EA5E9',
    todayAccentSoft: 'rgba(14, 165, 233, 0.18)',
    todayAccentAlert: themePresets.light.values.todayAccentAlert,
    todayAccentAlertSoft: themePresets.light.values.todayAccentAlertSoft,
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#ef4444',
    navBg: 'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(235,233,255,0.32) 100%)',
    primary: customColors.primary || themePresets.light.values.primary,
    secondary: customColors.secondary || themePresets.light.values.secondary,
    tertiary: customColors.tertiary || themePresets.light.values.tertiary,
    white: customColors.white || themePresets.light.values.white,
    muted: customColors.muted || themePresets.light.values.muted,
  },
});

const applyCssVariables = (paletteValues) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(cssVariableMap).forEach(([key, variable]) => {
    if (paletteValues[key]) {
      root.style.setProperty(variable, paletteValues[key]);
    }
  });
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(getInitialThemeName);
  const [customColors, setCustomColors] = useState(getInitialCustomColors);

  const activePalette = useMemo(() => {
    if (currentTheme === 'custom') {
      return buildCustomPalette(customColors);
    }
    return themePresets[currentTheme] || themePresets.light;
  }, [currentTheme, customColors]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('appTheme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('customThemeColors', JSON.stringify(customColors));
  }, [customColors]);

  useEffect(() => {
    applyCssVariables(activePalette.values);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    }
  }, [activePalette, currentTheme]);

  const changeTheme = (themeName) => {
    if (themeName === currentTheme) return;
    setCurrentTheme(themeName);
  };

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateCustomColor = (key, value) => {
    setCustomColors((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetCustomTheme = () => {
    setCustomColors(defaultCustom);
    setCurrentTheme('custom');
  };

  const value = {
    currentTheme,
    theme: activePalette.values,
    themes: themePresets,
    changeTheme,
    toggleTheme,
    isDark: currentTheme === 'dark',
    customColors,
    updateCustomColor,
    resetCustomTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
