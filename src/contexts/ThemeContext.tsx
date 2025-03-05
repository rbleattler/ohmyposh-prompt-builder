import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import defaultTheme from '../default.omp.json';

interface ThemeContextType {
  theme: any;
  updateTheme: (newTheme: any) => void;
  resetTheme: () => void;
  importTheme: (themeJson: string) => void;
  exportTheme: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to convert default theme to ensure Unicode sequences are preserved
const getDefaultTheme = (): any => {
  // Create a deep copy with JSON serialization to standardize the format
  const themeStr = JSON.stringify(defaultTheme);
  return JSON.parse(themeStr);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<any>(getDefaultTheme());
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('oh-my-posh-theme');
      if (savedTheme) {
        setTheme(JSON.parse(savedTheme));
      }
    } catch (err) {
      console.error('Failed to load theme from localStorage:', err);
      // Fallback to default theme if stored theme is invalid
      setTheme(getDefaultTheme());
    }
  }, []);

  // Save to localStorage when theme changes
  useEffect(() => {
    try {
      localStorage.setItem('oh-my-posh-theme', JSON.stringify(theme));
    } catch (err) {
      console.error('Failed to save theme to localStorage:', err);
    }
  }, [theme]);

  const updateTheme = useCallback((newTheme: any) => {
    try {
      setTheme(newTheme);
    } catch (err) {
      setError(`Failed to update theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  const resetTheme = useCallback(() => {
    try {
      setTheme(getDefaultTheme());
    } catch (err) {
      setError(`Failed to reset theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  const importTheme = useCallback((themeJson: string) => {
    try {
      const parsedTheme = JSON.parse(themeJson);
      if (parsedTheme) {
        setTheme(parsedTheme);
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err) {
      setError(`Failed to import theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err; // Re-throw to allow caller to handle the error
    }
  }, []);

  const exportTheme = useCallback(() => {
    try {
      return JSON.stringify(theme, null, 2);
    } catch (err) {
      setError(`Failed to export theme: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return JSON.stringify(getDefaultTheme(), null, 2); // Fallback
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    updateTheme,
    resetTheme,
    importTheme,
    exportTheme,
  }), [theme, updateTheme, resetTheme, importTheme, exportTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {error && <div className="error-notification">{error}</div>}
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
