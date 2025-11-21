import React, { createContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or user settings
  useEffect(() => {
    const getSystemTheme = (): boolean => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const userTheme = (user as unknown as { settings?: { theme?: Theme } })?.settings?.theme;
    
    const activeTheme = savedTheme || userTheme || 'system';
    setThemeState(activeTheme);

    // Determine actual dark mode
    let actuallyDark = false;
    if (activeTheme === 'dark') {
      actuallyDark = true;
    } else if (activeTheme === 'system') {
      actuallyDark = getSystemTheme();
    }

    setIsDark(actuallyDark);
    applyTheme(actuallyDark);
    setIsInitialized(true);
  }, [user]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyTheme(e.matches);
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    
    if (dark) {
      html.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#f3f4f6';
    } else {
      html.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#333333';
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // Determine actual dark mode
    let actuallyDark = false;
    if (newTheme === 'dark') {
      actuallyDark = true;
    } else if (newTheme === 'system') {
      actuallyDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDark(actuallyDark);
    applyTheme(actuallyDark);
  };

  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
