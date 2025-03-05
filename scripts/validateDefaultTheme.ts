// Make this file a module
export {};

const fs = require('fs');
const path = require('path');
// Import like this to avoid TypeScript errors
const schemaValidation = require('../src/utils/schemaValidation');

// Path to the default theme
const DEFAULT_THEME_PATH = path.join(__dirname, '../src/defaults/defaultTheme.json');

interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string
  }>;
}

/**
 * Validates the default theme against the schema
 * Run this during build to ensure the shipped default theme is valid
 */
function validateDefaultTheme(): void {
  try {
    // Read the default theme file
    const themeContent = fs.readFileSync(DEFAULT_THEME_PATH, 'utf8');
    const theme = JSON.parse(themeContent);

    // Validate against schema
    const { valid, errors } = schemaValidation.validateThemeConfig(theme) as ValidationResult;

    if (!valid) {
      console.error('Default theme validation failed:');
      errors.forEach((error: { path: string; message: string }) => {
        console.error(`- ${error.path}: ${error.message}`);
      });
      process.exit(1); // Exit with error if default theme is invalid
    }

    console.log('Default theme is valid against the schema.');
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error('Error validating default theme:', error);
    process.exit(1);
  }
}

// Run the validation
validateDefaultTheme();
