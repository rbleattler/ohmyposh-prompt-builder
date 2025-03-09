import { SchemaControlMapper } from './SchemaControlMapper';
import { PropertyType } from './dynamicSegmentGenerator';

describe('SchemaControlMapper', () => {
  // Sample schema for testing
  const testSchema = {
    definitions: {
      segment: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          style: {
            type: 'string',
            enum: ['plain', 'powerline', 'diamond']
          },
          foreground: {
            type: 'string',
            format: 'color'
          },
          background: {
            type: 'string',
            format: 'color'
          }
        }
      },
      gitSegment: {
        allOf: [
          { $ref: '#/definitions/segment' },
          {
            properties: {
              properties: {
                type: 'object',
                properties: {
                  branch_icon: {
                    type: 'string',
                    description: 'Icon to display before branch name'
                  },
                  display_status: {
                    type: 'boolean',
                    description: 'Show changes, additions, deletions',
                    default: true
                  },
                  commit_icon: {
                    type: 'string',
                    description: 'Icon for commits'
                  },
                  status_colors: {
                    type: 'object',
                    properties: {
                      clean: {
                        type: 'string',
                        format: 'color'
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  };

  test('maps string schema property to StringType PropertyDefinition', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'branch_icon',
      { type: 'string', description: 'Branch icon' }
    );

    expect(propertyDef.type).toBe(PropertyType.STRING);
    expect(propertyDef.name).toBe('branch_icon');
    expect(propertyDef.description).toBe('Branch icon');
    expect(propertyDef.label).toBe('Branch Icon');
  });

  test('maps boolean schema property to BooleanType PropertyDefinition', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'display_status',
      { type: 'boolean', description: 'Show status', default: true }
    );

    expect(propertyDef.type).toBe(PropertyType.BOOLEAN);
    expect(propertyDef.name).toBe('display_status');
    expect(propertyDef.description).toBe('Show status');
    expect(propertyDef.defaultValue).toBe(true);
  });

  test('maps enum schema property to EnumType PropertyDefinition', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'style',
      {
        type: 'string',
        enum: ['plain', 'powerline', 'diamond'],
        default: 'powerline'
      }
    );

    expect(propertyDef.type).toBe(PropertyType.ENUM);
    expect(propertyDef.enumValues).toHaveLength(3);
    expect(propertyDef.enumValues![0].value).toBe('plain');
    expect(propertyDef.enumValues![0].label).toBe('Plain');
    expect(propertyDef.defaultValue).toBe('powerline');
  });

  test('applies special format for color properties', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'foreground',
      { type: 'string', format: 'color' }
    );

    expect(propertyDef.type).toBe(PropertyType.COLOR);
  });

  test('applies icon type based on property name', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'branch_icon',
      { type: 'string' }
    );

    expect(propertyDef.type).toBe(PropertyType.ICON);
  });

  test('maps nested object schema property', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'status_colors',
      {
        type: 'object',
        properties: {
          clean: { type: 'string', format: 'color' },
          modified: { type: 'string', format: 'color' }
        }
      }
    );

    expect(propertyDef.type).toBe(PropertyType.OBJECT);
    expect(propertyDef.children).toHaveLength(2);
    expect(propertyDef.children![0].name).toBe('clean');
    expect(propertyDef.children![0].type).toBe(PropertyType.COLOR);
    expect(propertyDef.children![1].name).toBe('modified');
    expect(propertyDef.children![1].type).toBe(PropertyType.COLOR);
  });

  test('maps array schema property with item type', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'icons',
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            icon: { type: 'string' }
          }
        }
      }
    );

    expect(propertyDef.type).toBe(PropertyType.ARRAY);
    expect(propertyDef.itemType).toBeDefined();
    expect(propertyDef.itemType!.type).toBe(PropertyType.OBJECT);
    expect(propertyDef.itemType!.children).toHaveLength(2);
  });

  test('resolves $ref references in schema', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'segmentRef',
      { $ref: '#/definitions/segment' }
    );

    expect(propertyDef.type).toBe(PropertyType.OBJECT);
    // The segment definition has 4 properties
    expect(propertyDef.children).toHaveLength(4);
  });

  test('generates appropriate control config for property definition', () => {
    const mapper = new SchemaControlMapper(testSchema);
    const propertyDef = mapper.mapSchemaToPropertyDefinition(
      'display_status',
      { type: 'boolean', description: 'Show status', default: true }
    );

    const controlConfig = mapper.getControlConfig(propertyDef);

    expect(controlConfig.controlType).toBe('boolean');
    expect(controlConfig.props.label).toBe('Display Status');
    expect(controlConfig.props.description).toBe('Show status');
    expect(controlConfig.props.defaultValue).toBe(true);
  });
});