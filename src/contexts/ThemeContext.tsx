import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════
// THEME & PREFERENCES CONTEXT (DS-4, DS-5, DS-9)
// ═══════════════════════════════════════════════════════════

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type DensityMode = 'compact' | 'cozy' | 'touch';
export type Locale = 'en' | 'hi' | 'ar';

interface Preferences {
  theme: ThemeMode;
  density: DensityMode;
  locale: Locale;
  numberFormat: 'western' | 'indian' | 'arabic';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  defaultCompanyId: string;
  defaultProjectId: string;
  defaultSiteId: string;
  landingRoute: string;
}

interface ThemeContextValue {
  theme: ThemeMode;
  density: DensityMode;
  locale: Locale;
  preferences: Preferences;
  setTheme: (t: ThemeMode) => void;
  setDensity: (d: DensityMode) => void;
  setLocale: (l: Locale) => void;
  updatePreferences: (p: Partial<Preferences>) => void;
}

const defaultPreferences: Preferences = {
  theme: 'light',
  density: 'cozy',
  locale: 'en',
  numberFormat: 'western',
  dateFormat: 'DD/MM/YYYY',
  defaultCompanyId: 'company-001',
  defaultProjectId: 'project-001',
  defaultSiteId: 'site-001',
  landingRoute: '/',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const saved = localStorage.getItem('erp-preferences');
    if (saved) {
      try { return { ...defaultPreferences, ...JSON.parse(saved) }; } catch { return defaultPreferences; }
    }
    // Honor OS preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return { ...defaultPreferences, theme: 'dark' };
    }
    return defaultPreferences;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
    document.documentElement.setAttribute('data-density', preferences.density);
    localStorage.setItem('erp-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const setTheme = useCallback((theme: ThemeMode) => {
    setPreferences(p => ({ ...p, theme }));
  }, []);

  const setDensity = useCallback((density: DensityMode) => {
    setPreferences(p => ({ ...p, density }));
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    setPreferences(p => ({ ...p, locale }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<Preferences>) => {
    setPreferences(p => ({ ...p, ...updates }));
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme: preferences.theme,
      density: preferences.density,
      locale: preferences.locale,
      preferences,
      setTheme,
      setDensity,
      setLocale,
      updatePreferences,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
