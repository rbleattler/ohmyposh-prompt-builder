import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { ColorPicker } from '../ColorPicker';
import { SchemaControlMapper } from '../../utils/SchemaControlMapper';
import FormFieldValidation from '../FormFieldValidation';
import SchemaControlFactory from './SchemaControlFactory';

interface DynamicSegmentConfigFactoryProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
  schema: any;
}

/**
 * A dynamic factory component for segment configuration forms
 * Uses the schema to generate UI controls for each segment type
 */
const DynamicSegmentConfigFactory: React.FC<DynamicSegmentConfigFactoryProps> = ({
  type,
  config,
  onChange,
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange,
  schema
}) => {
  const [segmentPropertyDef, setSegmentPropertyDef] = useState<any>(null);
  const safeConfig = config || {};

  // Find the segment definition in the schema
  useEffect(() => {
    if (!schema || !type) return;

    const mapper = new SchemaControlMapper(schema);

    // Find the segment type in the schema
    const segmentDef = findSegmentInSchema(schema, type);
    if (!segmentDef) return;

    // Map schema to property definition
    try {
      const propertyDef = mapper.mapSchemaToPropertyDefinition(type, segmentDef);
      setSegmentPropertyDef(propertyDef);
    } catch (error) {
      console.error(`Error mapping schema for segment type ${type}:`, error);
    }
  }, [schema, type]);

  // Apply defaults from the schema when initializing a new segment
  useEffect(() => {
    if (
      segmentPropertyDef &&
      (!safeConfig.properties || Object.keys(safeConfig.properties).length === 0)
    ) {
      // Extract default values from the property definition
      const defaults = extractDefaults(segmentPropertyDef);

      if (Object.keys(defaults).length > 0) {
        onChange({
          ...safeConfig,
          properties: { ...defaults }
        });
      }
    }
  }, [segmentPropertyDef, safeConfig, onChange]);

  // Common appearance section with color pickers
  const AppearanceSection = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1">Segment Appearance</Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" gutterBottom>
            Foreground Color
          </Typography>
          <ColorPicker
            color={foreground || '#ffffff'}
            onChange={onForegroundChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="caption" gutterBottom>
            Background Color
          </Typography>
          <ColorPicker
            color={background || '#000000'}
            onChange={onBackgroundChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Style</InputLabel>
            <Select
              value={safeConfig.style || 'powerline'}
              label="Style"
              onChange={(e) => onChange({ ...safeConfig, style: e.target.value })}
            >
              <MenuItem value="plain">Plain</MenuItem>
              <MenuItem value="powerline">Powerline</MenuItem>
              <MenuItem value="diamond">Diamond</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {safeConfig.style === 'powerline' && (
          <Grid item xs={12}>
            <SchemaControlFactory
              schema={schema}
              propertyName="powerline_symbol"
              propertySchema={{ type: "string", description: "Powerline separator symbol" }}
              value={safeConfig.powerline_symbol || '\uE0B0'}
              onChange={(value) => onChange({ ...safeConfig, powerline_symbol: value })}
              validationPath="powerline_symbol"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );

  // Render dynamic properties from schema
  const renderSchemaProperties = () => {
    if (!schema || !segmentPropertyDef || !segmentPropertyDef.children) {
      return (
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
          No configurable properties found for this segment type.
        </Typography>
      );
    }

    // Find properties related to the content
    const contentProperties = segmentPropertyDef.children.filter((prop: any) =>
      !['style', 'foreground', 'background', 'powerline_symbol', 'type'].includes(prop.name)
    );

    if (contentProperties.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
          No configurable properties found for this segment type.
        </Typography>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle1">Segment Configuration</Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {contentProperties.map((property: any) => (
            <Grid item xs={12} key={property.name}>
              <SchemaControlFactory
                schema={schema}
                propertyName={`properties.${property.name}`}
                propertySchema={{
                  type: property.type,
                  description: property.description,
                  default: property.defaultValue,
                  // Add other properties as needed
                  enum: property.enumValues?.map((e: any) => e.value),
                  format: property.format,
                  minimum: property.minimum,
                  maximum: property.maximum,
                  pattern: property.pattern,
                }}
                value={(safeConfig.properties || {})[property.name]}
                onChange={(value) => {
                  const updatedProperties = { ...(safeConfig.properties || {}) };
                  updatedProperties[property.name] = value;
                  onChange({ ...safeConfig, properties: updatedProperties });
                }}
                validationPath={`properties.${property.name}`}
                required={property.required}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <AppearanceSection />
      {renderSchemaProperties()}
    </Paper>
  );
};

// Helper function to find a segment definition in the schema
const findSegmentInSchema = (schema: any, segmentType: string) => {
  if (!schema || !schema.definitions) return null;

  // First look for an exact match
  for (const key in schema.definitions) {
    if (key.toLowerCase() === `${segmentType.toLowerCase()}segment`) {
      return schema.definitions[key];
    }
  }

  // Then look for a partial match
  for (const key in schema.definitions) {
    if (key.toLowerCase().includes(segmentType.toLowerCase())) {
      return schema.definitions[key];
    }
  }

  // If no specific segment found, return the base segment definition
  return schema.definitions.segment || null;
};

// Helper function to extract default values from property definitions
const extractDefaults = (propertyDef: any) => {
  if (!propertyDef || !propertyDef.children) return {};

  return propertyDef.children.reduce((defaults: Record<string, any>, prop: any) => {
    if (prop.defaultValue !== undefined) {
      defaults[prop.name] = prop.defaultValue;
    }
    return defaults;
  }, {});
};

export default DynamicSegmentConfigFactory;