import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { validateThemeConfig } from '../utils/schemaValidation';
import { useTheme } from './ThemeContext';

// Define the shape of our validation error
export interface ValidationError {
  path: string;
  message: string;
}

// Define the validation context state and operations
interface ValidationContextValue {
  // Validation state
  isValid: boolean;
  errors: ValidationError[];

  // Validation for specific paths
  getErrorsForPath: (path: string) => ValidationError[];
  hasErrorsForPath: (path: string) => boolean;

  // Manual validation actions
  validateConfig: () => void;
  clearErrors: () => void;
}

// Create the context with a default value
const ValidationContext = createContext<ValidationContextValue | undefined>(undefined);

// Provider component
export function ValidationProvider({ children }: { children: ReactNode }) {
  const { themeConfig } = useTheme();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(true);

  // Validate the entire theme configuration
  const validateConfig = useCallback(() => {
    if (!themeConfig) {
      setErrors([]);
      setIsValid(true);
      return;
    }

    try {
      const result = validateThemeConfig(themeConfig);
      setErrors(result.errors);
      setIsValid(result.valid);
    } catch (error) {
      console.error('Validation error:', error);
      setErrors([{
        path: 'root',
        message: `Schema validation failed: ${error instanceof Error ? error.message : String(error)}`,
      }]);
      setIsValid(false);
    }
  }, [themeConfig]);

  // Clear all validation errors
  const clearErrors = () => {
    setErrors([]);
    setIsValid(true);
  };

  // Get errors for a specific path
  const getErrorsForPath = (path: string): ValidationError[] => {
    return errors.filter(error => error.path === path || error.path.startsWith(`${path}/`));
  };

  // Check if a path has any errors
  const hasErrorsForPath = (path: string): boolean => {
    return getErrorsForPath(path).length > 0;
  };

  // Automatically validate when the theme changes
  useEffect(() => {
    validateConfig();
  }, [themeConfig, validateConfig]);

  // Create the context value
  const contextValue: ValidationContextValue = {
    isValid,
    errors,
    getErrorsForPath,
    hasErrorsForPath,
    validateConfig,
    clearErrors
  };

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );
}

// Custom hook for using the validation context
export function useValidation() {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
}
