import schema from '../schemas/schema.json';

/**
 * Utility functions for working with the oh-my-posh schema
 */

/**
 * Get the schema definition for a specific segment type
 * @param segmentType The type of segment to get the schema for
 * @returns The schema definition for the segment type or undefined if not found
 */
export function getSegmentSchema(segmentType: string): any {
  const capitalizedType = segmentType.charAt(0).toUpperCase() + segmentType.slice(1);
  return schema.definitions?.[`segment`];
}

/**
 * Get the block schema definition
 * @returns The schema definition for blocks
 */
export function getBlockSchema(): any {
  return schema.definitions?.block;
}

/**
 * Get default values for a segment type from the schema
 * @param segmentType The type of segment to get defaults for
 * @returns An object with default values for the segment type
 */
export function getSegmentDefaults(segmentType: string): Record<string, any> {
  const segmentSchema = getSegmentSchema(segmentType);
  if (!segmentSchema) return {};

  const defaults: Record<string, any> = {};

  // Only process properties if they exist
  if (segmentSchema.properties) {
    Object.entries(segmentSchema.properties).forEach(([key, value]: [string, any]) => {
      if (value.default !== undefined) {
        defaults[key] = value.default;
      }
    });
  }

  return defaults;
}

/**
 * Get the list of available segment types from the schema
 * @returns Array of segment type names
 */
export function getAvailableSegmentTypes(): string[] {
  if (!schema.definitions) return [];

  return Object.keys(schema.definitions)
    .filter(key => key.endsWith('Segment') && key !== 'Segment')
    .map(key => key.replace('Segment', '').toLowerCase());
}

/**
 * Check if a property is required for a segment type
 * @param segmentType The type of segment to check
 * @param property The property name to check
 * @returns Boolean indicating if the property is required
 */
export function isPropertyRequired(segmentType: string, property: string): boolean {
  const segmentSchema = getSegmentSchema(segmentType);
  if (!segmentSchema || !segmentSchema.required) return false;

  return segmentSchema.required.includes(property);
}

/**
 * Get the description for a property from the schema
 * @param segmentType The type of segment
 * @param property The property name
 * @returns The description string or undefined if not found
 */
export function getPropertyDescription(segmentType: string, property: string): string | undefined {
  const segmentSchema = getSegmentSchema(segmentType);
  if (!segmentSchema?.properties?.[property]) return undefined;

  return segmentSchema.properties[property].description;
}

/**
 * Get the entire schema object
 * @returns The full schema object
 */
export function getFullSchema(): any {
  return schema;
}

export default {
  getSegmentSchema,
  getBlockSchema,
  getSegmentDefaults,
  getAvailableSegmentTypes,
  isPropertyRequired,
  getPropertyDescription,
  getFullSchema,
};
