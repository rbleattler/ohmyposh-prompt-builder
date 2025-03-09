import React from 'react';
import { Box, Grid, Divider, Typography } from '@mui/material';
import ControlFactory from './ControlFactory';
import { PropertyDefinition } from '../utils/dynamicSegmentGenerator';

interface PropertyGroupRendererProps {
  title: string;
  properties: PropertyDefinition[];
  values: any;
  onChange: (property: PropertyDefinition, value: any) => void;
  basePath: string;
}

/**
 * Renders a group of properties with a title and controls
 */
const PropertyGroupRenderer: React.FC<PropertyGroupRendererProps> = ({
  title,
  properties,
  values,
  onChange,
  basePath
}) => {
  // Function to get current value from values object with fallback to default
  const getValue = (property: PropertyDefinition) => {
    // Handle nested properties
    if (property.name.includes('.')) {
      const parts = property.name.split('.');
      let current = values;

      // Navigate the object structure
      for (let i = 0; i < parts.length - 1; i++) {
        current = current?.[parts[i]] || {};
      }

      // Get the final property
      const finalProp = parts[parts.length - 1];
      return current?.[finalProp] !== undefined ? current[finalProp] : property.defaultValue;
    }

    // Handle properties object special case
    if (property.name.startsWith('properties.')) {
      const propName = property.name.replace('properties.', '');
      return values.properties?.[propName] !== undefined
        ? values.properties[propName]
        : property.defaultValue;
    }

    // Handle direct properties
    return values[property.name] !== undefined
      ? values[property.name]
      : property.defaultValue;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} key={property.name}>
            <ControlFactory
              property={property}
              value={getValue(property)}
              onChange={(value) => onChange(property, value)}
              validationPath={`${basePath}/${property.name}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PropertyGroupRenderer;
