import { SchemaControlMapper } from '../../utils/SchemaControlMapper';
import { PropertyDefinition } from '../../utils/dynamicSegmentGenerator';

/**
 * Schema cache utility to prevent unnecessary regeneration of components
 * when using the same schema data repeatedly
 */
class SchemaCache {
  private static instance: SchemaCache;
  private propertyDefinitions: Map<string, PropertyDefinition>;
  private lastSchemaHash: string;
  private mapper: SchemaControlMapper | null;

  private constructor() {
    this.propertyDefinitions = new Map();
    this.lastSchemaHash = '';
    this.mapper = null;
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): SchemaCache {
    if (!SchemaCache.instance) {
      SchemaCache.instance = new SchemaCache();
    }
    return SchemaCache.instance;
  }

  /**
   * Initialize or update the cache with a schema
   */
  public initWithSchema(schema: any): SchemaControlMapper {
    // Generate a simple hash of the schema to detect changes
    const schemaHash = this.generateSchemaHash(schema);

    // If schema has changed, clear the cache and create new mapper
    if (this.lastSchemaHash !== schemaHash) {
      this.propertyDefinitions.clear();
      this.lastSchemaHash = schemaHash;
      this.mapper = new SchemaControlMapper(schema);
    }

    return this.mapper!;
  }

  /**
   * Get a property definition from cache or generate it if not found
   */
  public getPropertyDefinition(
    schema: any,
    propertyName: string,
    propertySchema: any,
    required: boolean = false
  ): PropertyDefinition {
    const cacheKey = this.generatePropertyCacheKey(propertyName, propertySchema, required);

    if (!this.propertyDefinitions.has(cacheKey)) {
      const mapper = this.initWithSchema(schema);
      const propertyDef = mapper.mapSchemaToPropertyDefinition(propertyName, propertySchema, required);
      this.propertyDefinitions.set(cacheKey, propertyDef);
    }

    return this.propertyDefinitions.get(cacheKey)!;
  }

  /**
   * Generate a simple hash for a schema object
   */
  private generateSchemaHash(schema: any): string {
    // For simplicity, we'll use JSON.stringify with a subset of keys
    // In a production environment, consider using a proper hashing algorithm
    if (!schema) return '';

    try {
      // Extract only the essential parts of the schema that would affect UI generation
      const essentialParts = {
        definitionKeys: Object.keys(schema.definitions || {}),
        definitionsLength: Object.keys(schema.definitions || {}).length,
        // Add other essential schema properties as needed
      };

      return JSON.stringify(essentialParts);
    } catch (e) {
      console.error('Error generating schema hash:', e);
      return Math.random().toString(36).substring(2, 15);
    }
  }

  /**
   * Generate a cache key for property definitions
   */
  private generatePropertyCacheKey(propertyName: string, propertySchema: any, required: boolean): string {
    try {
      // Create a simple key with essential property information
      const key = {
        name: propertyName,
        type: propertySchema.type,
        format: propertySchema.format,
        required,
        enum: propertySchema.enum ? JSON.stringify(propertySchema.enum) : undefined,
        ref: propertySchema.$ref,
      };

      return JSON.stringify(key);
    } catch (e) {
      console.error('Error generating property cache key:', e);
      return `${propertyName}-${Math.random().toString(36).substring(2, 9)}`;
    }
  }

  /**
   * Clear the cache
   */
  public clear(): void {
    this.propertyDefinitions.clear();
    this.lastSchemaHash = '';
    this.mapper = null;
  }
}

export default SchemaCache;
