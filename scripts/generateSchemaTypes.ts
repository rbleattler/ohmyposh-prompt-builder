// Make this file a module
export {};

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { compile } = require('json-schema-to-typescript');
const { createHash } = require('crypto');
import { generateSegmentTypesFile } from '../src/ompConfigVisualizer/utils/segmentTypeGenerator';

// Schema URL for oh-my-posh
const SCHEMA_URL = 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json';

// Output directories
const SCHEMA_DIR = path.join(__dirname, '../src/schemas');
const TYPES_DIR = path.join(__dirname, '../src/types/schema');
const SCHEMA_META_PATH = path.join(SCHEMA_DIR, 'meta.json');

// Ensure directories exist
if (!fs.existsSync(SCHEMA_DIR)) {
  fs.mkdirSync(SCHEMA_DIR, { recursive: true });
}
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

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
 * Fetch the schema from GitHub
 */
async function fetchSchema(): Promise<any> {
  console.log(`Fetching schema from ${SCHEMA_URL}...`);
  try {
    const response = await axios.get(SCHEMA_URL);
    console.log('Schema fetched successfully');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch schema: ${error.response?.status} ${error.message}`);
    }
    throw error;
  }
}

/**
 * Save schema to a file and update metadata
 */
function saveSchema(schema: any): void {
  const schemaPath = path.join(SCHEMA_DIR, 'schema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
  console.log(`Schema saved to ${schemaPath}`);

  // Extract version and calculate hash
  const version = schema.$id?.split('/').pop() || 'unknown';
  const hash = calculateHash(schema);

  // Update schema metadata
  const now = new Date();
  const meta: SchemaMeta = {
    lastChecked: now.toISOString(),
    lastUpdated: now.toISOString(),
    version,
    hash
  };

  fs.writeFileSync(SCHEMA_META_PATH, JSON.stringify(meta, null, 2));
  console.log(`Schema metadata updated in ${SCHEMA_META_PATH}`);
}

/**
 * Generate main TypeScript interface for the schema
 */
async function generateMainInterface(schema: any): Promise<void> {
  console.log('Generating main schema interface...');
  const ts = await compile(schema, 'OhMyPoshSchema', {
    bannerComment: `
/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the 'generate-schema-types' script to regenerate this file.
 *
 * Schema URL: ${SCHEMA_URL}
 * Generated on: ${new Date().toISOString()}
 */`,
    style: {
      singleQuote: true,
      semi: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
    },
    enableConstEnums: true,
    unreachableDefinitions: true,
    strictIndexSignatures: true,
  });

  const outputPath = path.join(TYPES_DIR, 'index.ts');
  fs.writeFileSync(outputPath, ts);
  console.log(`Main schema interface saved to ${outputPath}`);
}

/**
 * Extract and generate specific type interfaces for different components
 */
async function generateComponentInterfaces(schema: any): Promise<void> {
  console.log('Generating component interfaces...');

  // Generate block interface
  if (schema.definitions && schema.definitions.Block) {
    const blockSchema = {
      ...schema.definitions.Block,
      $schema: schema.$schema,
      definitions: schema.definitions,
    };

    const blockTs = await compile(blockSchema, 'Block', {
      bannerComment: `
/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND.
 *
 * Generated on: ${new Date().toISOString()}
 */`,
      style: {
        singleQuote: true,
        semi: true,
      },
      unreachableDefinitions: false,
    });

    const blockPath = path.join(TYPES_DIR, 'block.ts');
    fs.writeFileSync(blockPath, blockTs);
    console.log(`Block interface saved to ${blockPath}`);
  }

  // Generate segment interfaces
  if (schema.definitions && schema.definitions.Segment) {
    const segmentSchema = {
      ...schema.definitions.Segment,
      $schema: schema.$schema,
      definitions: schema.definitions,
    };

    const segmentTs = await compile(segmentSchema, 'Segment', {
      bannerComment: `
/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND.
 *
 * Generated on: ${new Date().toISOString()}
 */`,
      style: {
        singleQuote: true,
        semi: true,
      },
      unreachableDefinitions: false,
    });

    const segmentPath = path.join(TYPES_DIR, 'segment.ts');
    fs.writeFileSync(segmentPath, segmentTs);
    console.log(`Segment interface saved to ${segmentPath}`);
  }

  // Generate specific segment type interfaces
  const segmentTypes = ['git', 'path', 'time', 'battery', 'os'];

  for (const type of segmentTypes) {
    if (schema.definitions && schema.definitions[`${type.charAt(0).toUpperCase() + type.slice(1)}Segment`]) {
      const typeSchema = {
        ...schema.definitions[`${type.charAt(0).toUpperCase() + type.slice(1)}Segment`],
        $schema: schema.$schema,
        definitions: schema.definitions,
      };

      const typeTs = await compile(typeSchema, `${type.charAt(0).toUpperCase() + type.slice(1)}Segment`, {
        bannerComment: `
/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND.
 *
 * Generated on: ${new Date().toISOString()}
 */`,
        style: {
          singleQuote: true,
          semi: true,
        },
        unreachableDefinitions: false,
      });

      const typePath = path.join(TYPES_DIR, `${type}Segment.ts`);
      fs.writeFileSync(typePath, typeTs);
      console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}Segment interface saved to ${typePath}`);
    }
  }
}

/**
 * Generate index file to export all types
 */
function generateIndexFile(): void {
  console.log('Generating index file for types...');

  const files = fs.readdirSync(TYPES_DIR)
    .filter(file => file !== 'index.ts' && file.endsWith('.ts'))
    .map(file => path.basename(file, '.ts'));

  const imports = files.map(file => `export * from './${file}';`).join('\n');
  const indexContent = `
/**
 * This file exports all the schema-generated types for the application.
 *
 * Generated on: ${new Date().toISOString()}
 */

${imports}
`;

  const indexPath = path.join(TYPES_DIR, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Index file saved to ${indexPath}`);
}

/**
 * Generate a schema service to check for updates
 */
function generateSchemaService(): void {
  console.log('Generating schema service...');

  const serviceContent = `/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the 'generate-schema-types' script to regenerate this file.
 *
 * Schema URL: ${SCHEMA_URL}
 * Generated on: ${new Date().toISOString()}
 */

import { useEffect, useState } from 'react';

/**
 * Schema version information
 */
export interface SchemaVersionInfo {
  lastChecked: string;
  lastUpdated: string;
  version: string;
  hash: string;
  isOutdated: boolean;
}

/**
 * Hook to check if the schema is up-to-date
 * @returns Schema version information
 */
export const useSchemaVersion = (): { schemaInfo: SchemaVersionInfo | null, isLoading: boolean, error: string | null } => {
  const [schemaInfo, setSchemaInfo] = useState<SchemaVersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSchema = async () => {
      try {
        setIsLoading(true);
        // Fetch both current schema meta and check for updates
        const meta = await import('../schemas/meta.json');

        // Check if the schema is older than 24 hours
        const lastChecked = new Date(meta.lastChecked);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60);

        const isOutdated = hoursDiff > 24;

        setSchemaInfo({
          ...meta,
          isOutdated
        });
        setIsLoading(false);
      } catch (err) {
        setError(\`Failed to check schema version: \${err instanceof Error ? err.message : String(err)}\`);
        setIsLoading(false);
      }
    };

    checkSchema();
  }, []);

  return { schemaInfo, isLoading, error };
};

/**
 * Get the last version update date as a formatted string
 */
export const getLastUpdatedFormatted = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Unknown date';
  }
};

export default {
  useSchemaVersion,
  getLastUpdatedFormatted
};`;

  const servicePath = path.join(__dirname, '../src/services/SchemaService.ts');
  fs.mkdirSync(path.dirname(servicePath), { recursive: true });
  fs.writeFileSync(servicePath, serviceContent);
  console.log(`Schema service generated at ${servicePath}`);
}

/**
 * Main function to run the type generation process
 */
async function main(): Promise<void> {
  try {
    const schema = await fetchSchema();
    saveSchema(schema);
    await generateMainInterface(schema);
    await generateComponentInterfaces(schema);
    generateIndexFile();
    generateSchemaService();

    // Also generate segment types from the schema
    generateSegmentTypesFile();

    console.log('Schema and segment type generation complete!');
  } catch (error) {
    console.error('Error generating schema types:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error in main:', err);
  process.exit(1);
});
