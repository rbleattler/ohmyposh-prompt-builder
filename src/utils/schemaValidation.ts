import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/schema.json';

// Initialize Ajv with the schema and options
const ajv = new Ajv({
  allErrors: true,
  strict: false, // Disable strict mode to allow formats not defined in spec
});

// Add standard formats like date-time, email, etc.
addFormats(ajv);

// Add custom format for color validation
ajv.addFormat('color', {
  validate: (str: string) => {
    // Accept any string as valid color for now
    // In the future, we could implement stricter validation
    return typeof str === 'string';
  }
});

const validate = ajv.compile(schema);

/**
 * Validate a theme configuration against the oh-my-posh schema
 */
export function validateThemeConfig(themeConfig: any): {
  valid: boolean;
  errors: Array<{ path: string; message: string }>
} {
  const valid = validate(themeConfig);

  if (!valid) {
    const errors = (validate.errors || []).map(err => ({
      path: err.instancePath || 'root',
      message: err.message || 'Unknown error',
    }));
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

/**
 * Validate a specific segment against its schema
 * @param segmentType The type of segment
 * @param segmentConfig The segment configuration to validate
 * @returns Object containing validation result and errors
 */
export function validateSegment(segmentType: string, segmentConfig: any): {
  valid: boolean;
  errors: Array<{ path: string; message: string }>
} {
  const capitalizedType = segmentType.charAt(0).toUpperCase() + segmentType.slice(1);
  // Fix the typescript error by using an explicit type assertion or index signature
  const definitionKey = `${capitalizedType}Segment` as keyof typeof schema.definitions;
  const segmentSchema = schema.definitions?.[definitionKey];

  if (!segmentSchema) {
    return {
      valid: false,
      errors: [{
        path: 'type',
        message: `Unknown segment type: ${segmentType}`
      }]
    };
  }

  // Create a validator for this segment type
  const segmentValidator = ajv.compile(segmentSchema);
  const valid = segmentValidator(segmentConfig);

  if (!valid) {
    const errors = (segmentValidator.errors || []).map(err => ({
      path: err.instancePath || 'segment',
      message: err.message || 'Unknown error',
    }));
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

/**
 * Validate a block configuration against the schema
 * @param blockConfig The block configuration to validate
 * @returns Object containing validation result and errors
 */
export function validateBlock(blockConfig: any): {
  valid: boolean;
  errors: Array<{ path: string; message: string }>
} {
  const blockSchema = schema.definitions?.block;

  if (!blockSchema) {
    return {
      valid: false,
      errors: [{
        path: 'block',
        message: 'Block schema not found'
      }]
    };
  }

  // Create a validator for blocks
  const blockValidator = ajv.compile(blockSchema);
  const valid = blockValidator(blockConfig);

  if (!valid) {
    const errors = (blockValidator.errors || []).map(err => ({
      path: err.instancePath || 'block',
      message: err.message || 'Unknown error',
    }));
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

export default {
  validateThemeConfig,
  validateSegment,
  validateBlock,
};
