'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import lightTheme from '../data/lightTheme.json';
import darkTheme from '../data/darkTheme.json';

export interface CustomTheme {
  colors: { primary: string; secondary: string; accent: string; background: string; surface: string; text: string; textSecondary: string; border: string; success: string; warning: string; error: string; };
  typography: { fontFamily: string; fontSize: { xs: string; sm: string; base: string; lg: string; xl: string; '2xl': string; }; fontWeight: { light: string; normal: string; medium: string; semibold: string; bold: string; }; };
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string; };
  borderRadius: { sm: string; md: string; lg: string; };
}

export type ThemeMode = 'light' | 'dark' | 'custom';

interface ThemeContextType {
  currentTheme: CustomTheme;
  themeMode: ThemeMode;
  updateTheme: (theme: CustomTheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  return context;
};

interface CustomThemeProviderProps { children: ReactNode; }

export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(lightTheme);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');

  const applyThemeToDocument = (theme: CustomTheme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => root.style.setProperty(`--color-${key}`, value));
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => root.style.setProperty(`--font-size-${key}`, value));
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => root.style.setProperty(`--font-weight-${key}`, value));
    Object.entries(theme.spacing).forEach(([key, value]) => root.style.setProperty(`--spacing-${key}`, value));
    Object.entries(theme.borderRadius).forEach(([key, value]) => root.style.setProperty(`--border-radius-${key}`, value));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('custom-theme');
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme && savedMode === 'custom') {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
        setThemeModeState('custom');
        applyThemeToDocument(parsedTheme);
      } catch (error) {
        console.error('Error loading saved theme:', error);
        setCurrentTheme(lightTheme);
        setThemeModeState('light');
        applyThemeToDocument(lightTheme);
      }
    } else if (savedMode === 'dark') {
      setCurrentTheme(darkTheme);
      setThemeModeState('dark');
      applyThemeToDocument(darkTheme);
    } else {
      setCurrentTheme(lightTheme);
      setThemeModeState('light');
      applyThemeToDocument(lightTheme);
    }
  }, []);

  const updateTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    applyThemeToDocument(theme);
    localStorage.setItem('custom-theme', JSON.stringify(theme));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme-mode', mode);
    if (mode === 'light') {
      setCurrentTheme(lightTheme);
      applyThemeToDocument(lightTheme);
    } else if (mode === 'dark') {
      setCurrentTheme(darkTheme);
      applyThemeToDocument(darkTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeMode, updateTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};