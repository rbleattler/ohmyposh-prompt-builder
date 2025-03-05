// Make this file a module by adding an export
export {};

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

// Schema URL for oh-my-posh
const SCHEMA_URL = 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json';

// Check if schema updates should be skipped (for CI/CD environments)
const SKIP_SCHEMA_CHECK = process.env.SKIP_SCHEMA_CHECK === 'true';

// Paths
const SCHEMA_DIR = path.join(__dirname, '../src/schemas');
const SCHEMA_PATH = path.join(SCHEMA_DIR, 'schema.json');
const SCHEMA_META_PATH = path.join(SCHEMA_DIR, 'meta.json');

// Type definitions
interface SchemaMeta {
  lastChecked: string;
  lastUpdated: string;
  version: string;
  hash: string;
}

/**
 * Calculate hash of a JSON object
 */
function calculateHash(data: any): string {
  const content = JSON.stringify(data);
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Load the current schema metadata
 */
function loadSchemaMeta(): SchemaMeta | null {
  try {
    if (fs.existsSync(SCHEMA_META_PATH)) {
      const metaContent = fs.readFileSync(SCHEMA_META_PATH, 'utf8');
      return JSON.parse(metaContent);
    }
  } catch (error) {
    console.error('Error loading schema metadata:', error);
  }
  return null;
}

/**
 * Save schema metadata
 */
function saveSchemaMeta(meta: SchemaMeta): void {
  if (!fs.existsSync(SCHEMA_DIR)) {
    fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  }
  fs.writeFileSync(SCHEMA_META_PATH, JSON.stringify(meta, null, 2));
}

/**
 * Fetch current schema from GitHub
 */
async function fetchLatestSchema(): Promise<any> {
  console.log(`Fetching schema from ${SCHEMA_URL}...`);
  try {
    const response = await axios.get(SCHEMA_URL);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch schema: ${error.response?.status} ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load the current local schema
 */
function loadCurrentSchema(): any {
  try {
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf8');
      return JSON.parse(schemaContent);
    }
  } catch (error) {
    console.error('Error loading local schema:', error);
  }
  return null;
}

/**
 * Determine if the schema has changed
 */
function hasSchemaChanged(currentSchema: any, latestSchema: any): boolean {
  const currentHash = calculateHash(currentSchema);
  const latestHash = calculateHash(latestSchema);
  return currentHash !== latestHash;
}

/**
 * Extract schema version
 */
function extractSchemaVersion(schema: any): string {
  return schema.$id?.split('/').pop() || 'unknown';
}

/**
 * Main function to check for schema updates
 */
async function main(): Promise<void> {
  // If we're skipping schema checks, exit with success
  if (SKIP_SCHEMA_CHECK) {
    console.log('Schema check skipped due to SKIP_SCHEMA_CHECK=true');
    process.exit(0);
  }

  try {
    const now = new Date();
    const currentSchema = loadCurrentSchema();
    const currentMeta = loadSchemaMeta();

    // If no schema exists yet, just indicate an update is needed
    if (!currentSchema) {
      console.log('Local schema not found. Update required.');
      process.exit(1); // Exit with non-zero code to indicate an update is needed
    }

    // Fetch the latest schema
    const latestSchema = await fetchLatestSchema();

    // Check if the schema has changed
    if (hasSchemaChanged(currentSchema, latestSchema)) {
      console.log('Schema has changed! Update required.');

      // Update metadata for reference
      const meta: SchemaMeta = {
        lastChecked: now.toISOString(),
        lastUpdated: now.toISOString(),
        version: extractSchemaVersion(latestSchema),
        hash: calculateHash(latestSchema)
      };
      saveSchemaMeta(meta);

      process.exit(1); // Exit with non-zero code to indicate an update is needed
    } else {
      console.log('Schema is up to date. No action needed.');

      // Update the "last checked" timestamp
      if (currentMeta) {
        saveSchemaMeta({
          ...currentMeta,
          lastChecked: now.toISOString()
        });
      } else {
        // Create new meta if it doesn't exist
        saveSchemaMeta({
          lastChecked: now.toISOString(),
          lastUpdated: now.toISOString(),
          version: extractSchemaVersion(currentSchema),
          hash: calculateHash(currentSchema)
        });
      }

      process.exit(0); // Exit with zero code to indicate no update is needed
    }
  } catch (error) {
    console.error('Error checking for schema updates:', error);

    // For CI/CD environments: don't fail the build if schema check fails
    if (process.env.CI) {
      console.log('Running in CI environment, continuing despite schema check error');
      process.exit(0);
    } else {
      process.exit(2); // Exit with code 2 for errors in non-CI environments
    }
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error in main:', err);
  process.exit(2);
});
