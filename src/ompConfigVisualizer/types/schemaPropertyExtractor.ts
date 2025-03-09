import { PropertyDefinition, PropertyType } from './dynamicSegmentGenerator';

/**
 * Utility to extract properties from JSON Schema
 */
export class SchemaPropertyExtractor {
  private schema: any;
  private definitions: any;

  constructor(schema: any) {
    this.schema = schema;
    this.definitions = schema.definitions || {};
  }

  /**
   * Extract properties for a specific segment type
   */
  extractSegmentProperties(segmentType: string): PropertyDefinition[] {
    try {
      // Find the segment type definition
      const segmentDefinition = this.findSegmentDefinition(segmentType);
      if (!segmentDefinition) {
        console.warn(`No definition found for segment type: ${segmentType}`);
        return [];
      }

      // Get the properties
      return this.extractPropertiesFromDefinition(segmentDefinition.properties);
    } catch (error) {
      console.error(`Error extracting properties for segment type ${segmentType}:`, error);
      return [];
    }
  }

  /**
   * Find the definition for a specific segment type
   */
  private findSegmentDefinition(segmentType: string): any {
    // Look for a specific segment type definition
    const typedSegmentDefinition = this.definitions[`${segmentType.charAt(0).toUpperCase() + segmentType.slice(1)}Segment`];
    if (typedSegmentDefinition) {
      return typedSegmentDefinition;
    }

    // Check if there's a generic segment definition with an enum for types
    const segmentDefinition = this.definitions['Segment'];
    if (segmentDefinition && segmentDefinition.properties?.type?.enum?.includes(segmentType)) {
      return segmentDefinition;
    }

    // If not found in direct definitions, try to find it in allOf or anyOf
    for (const [key, def] of Object.entries(this.definitions) as [string, any][]) {
      if (def.allOf) {
        for (const subDef of def.allOf) {
          if (subDef.properties?.type?.enum?.includes(segmentType)) {
            return { ...def, ...subDef };
          }
        }
      }

      if (def.anyOf) {
        for (const subDef of def.anyOf) {
          if (subDef.properties?.type?.enum?.includes(segmentType)) {
            return { ...def, ...subDef };
          }
        }
      }
    }

    return null;
  }

  /**
   * Extract properties from a schema definition
   */
  private extractPropertiesFromDefinition(properties: any): PropertyDefinition[] {
    if (!properties) return [];

    return Object.entries(properties).map(([propName, propDef]: [string, any]) => {
      // Skip internal or reserved properties
      if (propName.startsWith('_') || propName === 'type') {
        return null;
      }

      // Extract property information
      const propertyType = this.mapJsonSchemaTypeToPropertyType(propDef);

      // Create the property definition
      const property: PropertyDefinition = {
        name: propName,
        type: propertyType,
        label: this.formatPropertyLabel(propName),
        description: propDef.description || '',
        defaultValue: propDef.default,
        required: false, // Will be determined from required array in the parent object
      };

      // Add additional constraints
      if (propDef.minimum !== undefined) property.minimum = propDef.minimum;
      if (propDef.maximum !== undefined) property.maximum = propDef.maximum;
      if (propDef.pattern) property.pattern = propDef.pattern;
      if (propDef.format) property.format = propDef.format;

      // Handle enums
      if (propDef.enum) {
        property.type = PropertyType.ENUM;
        property.enumValues = propDef.enum.map((value: string) => ({
          value,
          label: this.formatEnumLabel(value),
        }));
      }

      // Handle objects with nested properties
      if (propertyType === PropertyType.OBJECT && propDef.properties) {
        property.children = this.extractPropertiesFromDefinition(propDef.properties);
      }

      // Handle arrays
      if (propertyType === PropertyType.ARRAY && propDef.items) {
        const itemType = this.mapJsonSchemaTypeToPropertyType(propDef.items);
        property.itemType = {
          name: `${propName}Item`,
          type: itemType,
          label: `${this.formatPropertyLabel(propName)} Item`,
          description: '',
          defaultValue: undefined,
          required: false,
        };

        // Handle array items that are enums
        if (propDef.items.enum) {
          property.itemType.type = PropertyType.ENUM;
          property.itemType.enumValues = propDef.items.enum.map((value: string) => ({
            value,
            label: this.formatEnumLabel(value),
          }));
        }
      }

      // Special handling for colors
      if (propName === 'foreground' || propName === 'background' ||
          propDef.format === 'color' || propName.includes('color')) {
        property.type = PropertyType.COLOR;
      }

      // Special handling for icons
      if (propName.includes('icon') || propName.includes('glyph') || propName.includes('symbol')) {
        property.type = PropertyType.ICON;
      }

      return property;
    }).filter(Boolean) as PropertyDefinition[];
  }

  /**
   * Map JSON Schema type to PropertyType
   */
  private mapJsonSchemaTypeToPropertyType(propDef: any): PropertyType {
    if (!propDef.type) return PropertyType.STRING;

    switch (propDef.type) {
      case 'string':
        return PropertyType.STRING;
      case 'number':
      case 'integer':
        return PropertyType.NUMBER;
      case 'boolean':
        return PropertyType.BOOLEAN;
      case 'object':
        return PropertyType.OBJECT;
      case 'array':
        return PropertyType.ARRAY;
      default:
        return PropertyType.STRING;
    }
  }

  /**
   * Format a property name into a readable label
   */
  private formatPropertyLabel(name: string): string {
    // Convert snake_case or camelCase to Title Case
    return name
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Format an enum value into a readable label
   */
  private formatEnumLabel(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}

export default SchemaPropertyExtractor;
