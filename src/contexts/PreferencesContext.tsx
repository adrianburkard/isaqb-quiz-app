/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme, FontSize, UserPreferences } from '../types';

const STORAGE_KEY = 'isaqb-quiz-preferences';

const defaultPreferences: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
};

interface PreferencesContextValue {
  preferences: UserPreferences;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
  resolvedTheme: 'light' | 'dark';
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return defaultPreferences;
}

function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply theme class to document
  const resolvedTheme = preferences.theme === 'system' ? systemTheme : preferences.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // Apply font size class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${preferences.fontSize}`);
  }, [preferences.fontSize]);

  const setTheme = (theme: Theme) => {
    const newPrefs = { ...preferences, theme };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const setFontSize = (fontSize: FontSize) => {
    const newPrefs = { ...preferences, fontSize };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setTheme, setFontSize, resolvedTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within PreferencesProvider');
  }
  return context;
}
