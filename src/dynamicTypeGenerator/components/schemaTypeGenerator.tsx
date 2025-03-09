import { compile, compileFromFile, JSONSchema } from 'json-schema-to-typescript';
import ompSchema from './schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();

// Helper function to generate a basic TypeScript interface from JSON schema
// This is a simplified version for browser use when compile() fails
function generateSimpleInterface(schema: JSONSchema, name: string = 'GeneratedSchema'): string {
  function getPropType(propSchema: any): string {
    if (!propSchema || !propSchema.type) return 'any';

    switch (propSchema.type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        if (propSchema.items) {
          const itemType = getPropType(propSchema.items);
          return `${itemType}[]`;
        }
        return 'any[]';
      case 'object':
        if (propSchema.properties) {
          const nestedProps = Object.entries(propSchema.properties).map(([name, schema]) =>
            `    ${name}: ${getPropType(schema)};`
          );
          return `{\n${nestedProps.join('\n')}\n  }`;
        }
        return '{ [key: string]: any }';
      default:
        return 'any';
    }
  }

  try {
    if (schema.type !== 'object' || !schema.properties) {
      return `interface ${name} {\n  [key: string]: any;\n}\n`;
    }

    const properties = schema.properties as Record<string, any>;
    const required = Array.isArray(schema.required) ? schema.required : [];

    const propStrings = Object.entries(properties).map(([propName, propSchema]) => {
      const isRequired = required.includes(propName);
      const propType = getPropType(propSchema);
      return `  ${propName}${isRequired ? '' : '?'}: ${propType};`;
    });

    return `interface ${name} {\n${propStrings.join('\n')}\n}\n`;
  } catch (error) {
    console.error('Error in simple interface generation:', error);
    return `interface ${name} {\n  [key: string]: any;\n}\n`;
  }
}



export async function generateTypesFromSchema(schema: JSONSchema): Promise<string> {
  var omp_schema = ompSchema as JSONSchema;
  try {
    // const ts = await compile(schema, 'GeneratedSchema');
    const ts = await compile(omp_schema, 'GeneratedSchema' );
    return ts;
  } catch (error) {
    console.error('Error generating types from schema:', error);
    // Fallback to simple interface generation for browser environment
    return generateSimpleInterface(schema);
  }
}

export function validateData(schema: JSONSchema, data: any): boolean {
  try {
    const validate = ajv.compile(schema);
    if (typeof validate !== 'function') {
      console.error('Error: validate is not a function', validate);
      return false;
    }

    const valid = validate(data);

    if (!valid && validate.errors) {
      console.error('Validation errors:', validate.errors);
    }

    return !!valid;
  } catch (error) {
    console.error('Error during validation:', error);
    return false;
  }
}