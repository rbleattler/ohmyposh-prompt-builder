// Import PropertyDefinition and PropertyType from dynamicSegmentGenerator
import { PropertyDefinition, PropertyType } from './dynamicSegmentGenerator';

/**
 * Interface for JSON Schema property definition
 */
export interface JsonSchemaProperty {
  type?: string | string[];
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  required?: boolean;
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
  $ref?: string;
  anyOf?: JsonSchemaProperty[];
  allOf?: JsonSchemaProperty[];
  oneOf?: JsonSchemaProperty[];
}

/**
 * Control configuration for UI rendering
 */
export interface ControlConfig {
  controlType: string;  // Maps to a specific UI component
  props: Record<string, any>; // Properties to pass to the control
  validation?: Record<string, any>; // Validation rules
}

/**
 * Utility class for mapping JSON schema properties to UI controls
 */
export class SchemaControlMapper {
  private definitions: Record<string, any>;

  /**
   * Initialize with a JSON schema
   */
  constructor(schema: any) {
    // Store schema definitions for resolving references
    this.definitions = schema?.definitions || {};
  }

  /**
   * Map a JSON schema property to a PropertyDefinition
   */
  mapSchemaToPropertyDefinition(
    propName: string,
    propSchema: JsonSchemaProperty,
    required: boolean = false
  ): PropertyDefinition {
    // Handle reference resolution first
    if (propSchema.$ref) {
      const resolvedSchema = this.resolveReference(propSchema.$ref);
      if (resolvedSchema) {
        return this.mapSchemaToPropertyDefinition(propName, resolvedSchema, required);
      }
    }

    // Get the property type
    const propType = this.determinePropertyType(propSchema);

    // Create the base property definition
    const propertyDef: PropertyDefinition = {
      name: propName,
      type: propType,
      label: this.formatPropertyLabel(propName),
      description: propSchema.description || '',
      defaultValue: propSchema.default,
      required: required,
    };

    // Add constraints
    if (propSchema.minimum !== undefined) propertyDef.minimum = propSchema.minimum;
    if (propSchema.maximum !== undefined) propertyDef.maximum = propSchema.maximum;
    if (propSchema.pattern) propertyDef.pattern = propSchema.pattern;

    // Apply special formats based on property name or format
    this.applySpecialFormats(propName, propSchema, propertyDef);

    // Handle enum values
    if (propSchema.enum && Array.isArray(propSchema.enum)) {
      propertyDef.type = PropertyType.ENUM;
      propertyDef.enumValues = propSchema.enum.map(value => ({
        value,
        label: this.formatEnumLabel(String(value))
      }));
    }

    // Handle nested objects
    if (propType === PropertyType.OBJECT && propSchema.properties) {
      propertyDef.children = this.mapObjectProperties(
        propSchema.properties,
        Array.isArray(propSchema.required) ? propSchema.required : []
      );
    }

    // Handle array items
    if (propType === PropertyType.ARRAY && propSchema.items) {
      propertyDef.itemType = this.mapArrayItemType(propSchema.items);
    }

    return propertyDef;
  }

  /**
   * Map all properties from an object schema
   */
  mapObjectProperties(properties: Record<string, JsonSchemaProperty>, required: string[] = []): PropertyDefinition[] {
    return Object.entries(properties).map(([name, schema]) =>
      this.mapSchemaToPropertyDefinition(name, schema, required.includes(name))
    );
  }

  /**
   * Map array item type
   */
  private mapArrayItemType(itemSchema: JsonSchemaProperty): PropertyDefinition {
    return this.mapSchemaToPropertyDefinition('item', itemSchema);
  }

  /**
   * Determine property type from schema
   */
  private determinePropertyType(propSchema: JsonSchemaProperty): PropertyType {
    if (propSchema.$ref) {
      const resolvedSchema = this.resolveReference(propSchema.$ref);
      if (resolvedSchema) {
        return this.determinePropertyType(resolvedSchema);
      }
    }

    const type = Array.isArray(propSchema.type) ? propSchema.type[0] : propSchema.type;

    switch (type) {
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
        // Default to string if type is not specified or unknown
        return PropertyType.STRING;
    }
  }

  /**
   * Apply special formats based on naming conventions and format specifier
   */
  private applySpecialFormats(propName: string, propSchema: JsonSchemaProperty, propertyDef: PropertyDefinition): void {
    // Check for color format
    if (propSchema.format === 'color' ||
        propName.includes('color') ||
        propName === 'foreground' ||
        propName === 'background') {
      propertyDef.type = PropertyType.COLOR;
      return;
    }

    // Check for icon format
    if (propName.includes('icon') || propName.includes('glyph') || propName.includes('symbol')) {
      propertyDef.type = PropertyType.ICON;
      return;
    }

    // Check for other formats
    if (propSchema.format) {
      switch (propSchema.format) {
        case 'date':
        case 'date-time':
        case 'time':
          propertyDef.format = propSchema.format;
          break;
        case 'email':
        case 'uri':
        case 'uri-reference':
        case 'hostname':
          propertyDef.format = propSchema.format;
          break;
      }
    }
  }

  /**
   * Resolve a $ref pointer to its schema definition
   */
  private resolveReference(ref: string): JsonSchemaProperty | null {
    if (!ref.startsWith('#/definitions/')) {
      return null;
    }

    const path = ref.substring('#/definitions/'.length).split('/');
    let definition = this.definitions[path[0]];

    for (let i = 1; i < path.length; i++) {
      if (!definition) return null;
      definition = definition[path[i]];
    }

    return definition || null;
  }

  /**
   * Format a property name into a readable label
   */
  private formatPropertyLabel(name: string): string {
    // Transform property name to a user-friendly label
    // e.g., "user_name" -> "User Name"
    return name
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Format an enum value into a readable label
   */
  private formatEnumLabel(value: string): string {
    // Transform enum value to a user-friendly label
    // e.g., "user_role" -> "User Role"
    return value
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get a control configuration for a property
   */
  getControlConfig(property: PropertyDefinition): ControlConfig {
    const controlConfig: ControlConfig = {
      controlType: this.getControlType(property),
      props: {
        label: property.label,
        description: property.description,
        required: property.required,
        defaultValue: property.defaultValue,
      },
      validation: {}
    };

    // Add validation rules
    if (property.pattern) {
      controlConfig.validation!.pattern = property.pattern;
    }

    if (property.minimum !== undefined) {
      controlConfig.validation!.min = property.minimum;
    }

    if (property.maximum !== undefined) {
      controlConfig.validation!.max = property.maximum;
    }

    // Add additional properties based on type
    switch (property.type) {
      case PropertyType.ENUM:
        controlConfig.props.options = property.enumValues;
        break;
      case PropertyType.ARRAY:
        controlConfig.props.itemType = property.itemType;
        break;
      case PropertyType.OBJECT:
        controlConfig.props.children = property.children;
        break;
    }

    return controlConfig;
  }

  /**
   * Map a schema property to a complete control definition
   */
  mapPropertyToControl(propName: string, propSchema: JsonSchemaProperty, required: boolean = false): {
    propertyDef: PropertyDefinition;
    controlConfig: ControlConfig;
  } {
    const propertyDef = this.mapSchemaToPropertyDefinition(propName, propSchema, required);
    const controlConfig = this.getControlConfig(propertyDef);

    return { propertyDef, controlConfig };
  }

  /**
   * Get the control type based on property type
   */
  private getControlType(property: PropertyDefinition): string {
    switch (property.type) {
      case PropertyType.STRING:
        return 'string';
      case PropertyType.NUMBER:
        return 'number';
      case PropertyType.BOOLEAN:
        return 'boolean';
      case PropertyType.COLOR:
        return 'color';
      case PropertyType.ICON:
        return 'icon';
      case PropertyType.ENUM:
        return 'enum';
      case PropertyType.OBJECT:
        return 'object';
      case PropertyType.ARRAY:
        return 'array';
      default:
        return 'string';
    }
  }
}

export default SchemaControlMapper;