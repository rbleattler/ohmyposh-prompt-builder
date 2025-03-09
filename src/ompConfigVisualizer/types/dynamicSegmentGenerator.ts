import { SEGMENT_TYPES } from '../generated/segmentTypes';

/**
 * Schema property types that can be mapped to UI controls
 */
export enum PropertyType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  ENUM = 'enum',
  COLOR = 'color',
  ICON = 'icon',
  FORMAT = 'format',
  // Add more as needed
}

/**
 * Property definition with UI control information
 */
export interface PropertyDefinition {
  name: string;
  type: PropertyType;
  label: string;
  description?: string;
  defaultValue: any;
  required: boolean;
  enumValues?: Array<{ value: string; label: string }>;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  format?: string;
  children?: PropertyDefinition[]; // For object properties
  itemType?: PropertyDefinition; // For array properties
}

/**
 * Segment UI configuration derived from the schema
 */
export interface SegmentUiConfig {
  type: string;
  name: string;
  description: string;
  properties: PropertyDefinition[];
  propertyGroups: {
    [key: string]: {
      title: string;
      properties: string[]; // Property names in this group
    };
  };
}

/**
 * Extract property definitions from schema for a specific segment type
 * This is a placeholder implementation. In the actual implementation,
 * this would parse the JSON schema to extract property definitions.
 */
export function extractPropertiesFromSchema(segmentType: string): PropertyDefinition[] {
  // In a real implementation, we would:
  // 1. Find the schema definition for this segment type
  // 2. Extract property definitions including types, constraints, etc.
  // 3. Map them to PropertyDefinition objects

  // For now, return a placeholder implementation based on segment type
  switch (segmentType) {
    case 'path':
      return [
        {
          name: 'style',
          type: PropertyType.ENUM,
          label: 'Path Style',
          description: 'How to display the current path',
          defaultValue: 'folder',
          required: false,
          enumValues: [
            { value: 'folder', label: 'Folder Name Only' },
            { value: 'full', label: 'Full Path' },
            { value: 'agnoster', label: 'Agnoster (Short)' },
            { value: 'agnoster_full', label: 'Agnoster (Full)' },
            { value: 'agnoster_short', label: 'Agnoster (Short + Tilde)' },
          ],
        },
        {
          name: 'max_width',
          type: PropertyType.NUMBER,
          label: 'Maximum Width',
          description: 'Maximum width of the path (0 for no limit)',
          defaultValue: 0,
          required: false,
          minimum: 0,
        },
        // Add more properties as needed
      ];

    case 'git':
      return [
        {
          name: 'branch_icon',
          type: PropertyType.STRING,
          label: 'Branch Icon',
          description: 'Icon to display before branch name',
          defaultValue: '',
          required: false,
        },
        {
          name: 'display_status',
          type: PropertyType.BOOLEAN,
          label: 'Display Status',
          description: 'Show changes, additions, deletions',
          defaultValue: true,
          required: false,
        },
        // Add more properties as needed
      ];

    // Add cases for other segment types

    default:
      return []; // Empty array for unknown segment types
  }
}

/**
 * Generate a segment UI configuration from the schema
 */
export function generateSegmentUiConfig(segmentType: string): SegmentUiConfig | null {
  const segmentTypeInfo = SEGMENT_TYPES.find(s => s.type === segmentType);
  if (!segmentTypeInfo) return null;

  const properties = extractPropertiesFromSchema(segmentType);

  // Group properties (in a real implementation, this would use schema information)
  const propertyGroups: SegmentUiConfig['propertyGroups'] = {
    appearance: {
      title: 'Appearance',
      properties: properties
        .filter(p => ['style', 'foreground', 'background'].includes(p.name))
        .map(p => p.name),
    },
    content: {
      title: 'Content',
      properties: properties
        .filter(p => !['style', 'foreground', 'background'].includes(p.name))
        .map(p => p.name),
    },
  };

  return {
    type: segmentType,
    name: segmentTypeInfo.name,
    description: segmentTypeInfo.description,
    properties,
    propertyGroups,
  };
}

/**
 * This is a placeholder for the full implementation.
 * In the real implementation, this would:
 * 1. Read from the actual JSON Schema
 * 2. Find the segment type definition
 * 3. Extract properties, types, constraints, etc.
 */
export function getSegmentPropertiesFromSchema(segmentType: string): PropertyDefinition[] {
  // For now, just return the placeholder implementation
  return extractPropertiesFromSchema(segmentType);
}

/**
 * Generate a dynamic segment based on schema and type
 */
export function generateDynamicSegment(type: string, config: any, schema: any): any {
  // Find segment definition in schema
  const segmentDefinition = findSegmentDefinition(schema, type);

  if (!segmentDefinition) {
    return {
      type,
      ...config
    };
  }

  // Apply defaults from schema definition
  const defaultProperties = extractDefaultProperties(segmentDefinition);

  return {
    type,
    properties: {
      ...defaultProperties,
      ...config?.properties
    },
    ...config
  };
}

/**
 * Find a segment definition in the schema by type
 */
export function findSegmentDefinition(schema: any, segmentType: string): any {
  if (!schema || !schema.definitions) return null;

  // Look for an exact match first
  const exactMatchKey = `${segmentType}Segment`.toLowerCase();
  for (const key in schema.definitions) {
    if (key.toLowerCase() === exactMatchKey) {
      return schema.definitions[key];
    }
  }

  // Look for a partial match
  for (const key in schema.definitions) {
    if (key.toLowerCase().includes(segmentType.toLowerCase())) {
      return schema.definitions[key];
    }
  }

  // Return the base segment definition if no specific one is found
  return schema.definitions.segment || null;
}

/**
 * Extract default properties from a segment definition
 */
export function extractDefaultProperties(definition: any): Record<string, any> {
  if (!definition || !definition.properties || !definition.properties.properties) {
    return {};
  }

  const props = definition.properties.properties;

  if (!props.properties) {
    return {};
  }

  const result: Record<string, any> = {};

  // Extract default values
  for (const propName in props.properties) {
    if (props.properties[propName].default !== undefined) {
      result[propName] = props.properties[propName].default;
    }
  }

  return result;
}

/**
 * Format a property name to a readable label
 */
export function formatPropertyLabel(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
