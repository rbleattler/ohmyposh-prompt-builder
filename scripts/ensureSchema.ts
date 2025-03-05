export {};

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths
const SCHEMA_DIR = path.join(__dirname, '../src/schemas');
const SCHEMA_PATH = path.join(SCHEMA_DIR, 'schema.json');

/**
 * This script ensures that the schema exists before building
 * It's particularly useful in CI/CD environments or first-time builds
 */
function ensureSchemaExists(): void {
  try {
    // Check if schema directory exists
    if (!fs.existsSync(SCHEMA_DIR)) {
      fs.mkdirSync(SCHEMA_DIR, { recursive: true });
    }

    // Check if schema file exists
    if (!fs.existsSync(SCHEMA_PATH)) {
      console.log('Schema not found, generating from scratch...');

      // Run the schema generation script
      execSync('npm run generate-schema-types', {
        stdio: 'inherit',
        encoding: 'utf-8'
      });

      console.log('Schema generated successfully.');
    } else {
      console.log('Schema exists, checking for updates...');

      // Use the update-schema script to check and update if needed
      try {
        execSync('npm run update-schema', {
          stdio: 'inherit',
          encoding: 'utf-8'
        });
        console.log('Schema check complete.');
      } catch (err) {
        console.log('Schema update process completed with warnings.');
      }
    }
  } catch (error) {
    console.error('Error ensuring schema exists:', error);
    process.exit(1);
  }
}

// Run the function
ensureSchemaExists();
