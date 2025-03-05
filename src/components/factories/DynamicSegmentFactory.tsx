import React, { useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  FormHelperText,
  Grid,
  Divider,
} from '@mui/material';
import { SegmentUiConfig } from '../../utils/dynamicSegmentGenerator';
import { ColorPicker } from '../ColorPicker';
import { useValidation } from '../../contexts/ValidationContext';
import FormFieldValidation from '../FormFieldValidation';
import PropertyGroupRenderer from './PropertyGroupRenderer';
import ControlFactory from './ControlFactory';
import { SchemaPropertyExtractor } from '../../utils/schemaPropertyExtractor';

interface DynamicSegmentFactoryProps {
  type: string;
  segmentConfig: any;
  onChange: (updatedConfig: any) => void;
  segmentIndex: number;
  blockIndex: number;
  schema?: any; // Optional schema to use for property extraction
}

/**
 * Enhanced factory component for dynamic segment configuration
 * This version integrates with SchemaPropertyExtractor for better schema handling
 */
const DynamicSegmentFactory: React.FC<DynamicSegmentFactoryProps> = ({
  type,
  segmentConfig,
  onChange,
  segmentIndex,
  blockIndex,
  schema
}) => {
  const { getErrorsForPath } = useValidation();
  const basePath = `/blocks/${blockIndex}/segments/${segmentIndex}`;

  // Create UI configuration from schema if available
  const uiConfig = useMemo(() => {
    if (schema) {
      // Extract properties from schema
      try {
        const extractor = new SchemaPropertyExtractor(schema);
        const properties = extractor.extractSegmentProperties(type);

        // Group properties
        const appearanceProps = properties.filter(p =>
          ['style', 'foreground', 'background', 'powerline_symbol'].includes(p.name)
        );

        const contentProps = properties.filter(p =>
          !['style', 'foreground', 'background', 'powerline_symbol', 'type'].includes(p.name)
        );

        // Create property groups
        const propertyGroups = {
          content: {
            title: 'Content',
            properties: contentProps.map(p => p.name)
          }
        };

        return {
          type,
          name: type.charAt(0).toUpperCase() + type.slice(1),
          description: `Configuration for ${type} segment`,
          properties: [...contentProps],
          propertyGroups
        } as SegmentUiConfig;
      } catch (error) {
        console.error('Error extracting properties from schema:', error);
      }
    }

    // Fall back to placeholder implementation in generateSegmentUiConfig
    const placeholderConfig = {
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      description: `Configuration for ${type} segment`,
      properties: [],
      propertyGroups: {}
    } as SegmentUiConfig;

    return placeholderConfig;
  }, [schema, type]);

  // Apply defaults from schema if segment is new
  useEffect(() => {
    if (Object.keys(segmentConfig).length <= 2 && uiConfig) {
      // This appears to be a new segment, so apply defaults from schema
      const defaults = uiConfig.properties.reduce((acc, prop) => {
        if (prop.defaultValue !== undefined) {
          if (prop.name.includes('.')) {
            // Handle nested properties
            const parts = prop.name.split('.');
            let current = acc;

            // Create nested structure
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) {
                current[parts[i]] = {};
              }
              current = current[parts[i]];
            }

            // Set the value
            current[parts[parts.length - 1]] = prop.defaultValue;
          } else {
            // Set direct property
            acc[prop.name] = prop.defaultValue;
          }
        }
        return acc;
      }, {} as Record<string, any>);

      // Apply defaults
      onChange({
        ...segmentConfig,
        ...defaults,
        style: segmentConfig.style || 'powerline',
        foreground: segmentConfig.foreground || '#ffffff',
        background: segmentConfig.background || getDefaultBackgroundColor(type)
      });
    }
  }, [segmentConfig, uiConfig, onChange, type]);

  // Get a default background color based on segment type
  const getDefaultBackgroundColor = (type: string): string => {
    // Color mapping for different segment types
    const colorMap: Record<string, string> = {
      path: '#61AFEF',
      git: '#C678DD',
      time: '#98C379',
      battery: '#E5C07B',
      os: '#E06C75',
      text: '#56B6C2',
      command: '#ABB2BF'
    };

    return colorMap[type] || '#444444';
  };

  // Handle property changes - Fixed to remove validateValue call
  const handlePropertyChange = (propertyName: string, value: any) => {
    if (propertyName.includes('.')) {
      // Handle nested properties
      const parts = propertyName.split('.');
      const updatedConfig = { ...segmentConfig };
      let current = updatedConfig;

      // Navigate and create the object structure
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }

      // Set the value
      current[parts[parts.length - 1]] = value;
      onChange(updatedConfig);
      // Removed validateValue call as it doesn't exist
    } else {
      // Handle direct property
      onChange({
        ...segmentConfig,
        [propertyName]: value
      });
      // Removed validateValue call as it doesn't exist
    }
  };

  // If no properties defined, show a placeholder
  if (!uiConfig || uiConfig.properties.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {type.charAt(0).toUpperCase() + type.slice(1)} Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          No configurable properties found for this segment type.
        </Typography>

        {/* Default segment appearance options */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Appearance
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>
                Foreground Color
                <FormFieldValidation path={`${basePath}/foreground`} />
              </Typography>
              <ColorPicker
                color={segmentConfig.foreground || '#ffffff'}
                onChange={(color) => handlePropertyChange('foreground', color)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>
                Background Color
                <FormFieldValidation path={`${basePath}/background`} />
              </Typography>
              <ColorPicker
                color={segmentConfig.background || '#000000'}
                onChange={(color) => handlePropertyChange('background', color)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                size="small"
                error={!!getErrorsForPath(`${basePath}/style`).length}
              >
                <InputLabel>Segment Style</InputLabel>
                <Select
                  value={segmentConfig.style || 'plain'}
                  label="Segment Style"
                  onChange={(e) => handlePropertyChange('style', e.target.value)}
                  endAdornment={<FormFieldValidation path={`${basePath}/style`} />}
                >
                  <MenuItem value="plain">Plain</MenuItem>
                  <MenuItem value="powerline">Powerline</MenuItem>
                  <MenuItem value="diamond">Diamond</MenuItem>
                </Select>
                <FormHelperText>
                  Visual style of the segment
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Conditional powerline symbol field */}
            {segmentConfig.style === 'powerline' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Powerline Symbol"
                  value={segmentConfig.powerline_symbol || ''}
                  onChange={(e) => handlePropertyChange('powerline_symbol', e.target.value)}
                  size="small"
                  error={!!getErrorsForPath(`${basePath}/powerline_symbol`).length}
                  helperText="Symbol to use for the powerline style (e.g. \uE0B0)"
                  InputProps={{
                    endAdornment: <FormFieldValidation path={`${basePath}/powerline_symbol`} />
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    );
  }

  // Render the full UI with property groups
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {uiConfig.name} Configuration
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        {uiConfig.description}
      </Typography>

      {/* Render standard appearance options */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Appearance
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom>
              Foreground Color
              <FormFieldValidation path={`${basePath}/foreground`} />
            </Typography>
            <ColorPicker
              color={segmentConfig.foreground || '#ffffff'}
              onChange={(color) => handlePropertyChange('foreground', color)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom>
              Background Color
              <FormFieldValidation path={`${basePath}/background`} />
            </Typography>
            <ColorPicker
              color={segmentConfig.background || '#000000'}
              onChange={(color) => handlePropertyChange('background', color)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl
              fullWidth
              size="small"
              error={!!getErrorsForPath(`${basePath}/style`).length}
            >
              <InputLabel>Segment Style</InputLabel>
              <Select
                value={segmentConfig.style || 'plain'}
                label="Segment Style"
                onChange={(e) => handlePropertyChange('style', e.target.value)}
                endAdornment={<FormFieldValidation path={`${basePath}/style`} />}
              >
                <MenuItem value="plain">Plain</MenuItem>
                <MenuItem value="powerline">Powerline</MenuItem>
                <MenuItem value="diamond">Diamond</MenuItem>
              </Select>
              <FormHelperText>
                Visual style of the segment
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Conditional powerline symbol field */}
          {segmentConfig.style === 'powerline' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Powerline Symbol"
                value={segmentConfig.powerline_symbol || ''}
                onChange={(e) => handlePropertyChange('powerline_symbol', e.target.value)}
                size="small"
                error={!!getErrorsForPath(`${basePath}/powerline_symbol`).length}
                helperText="Symbol to use for the powerline style (e.g. \uE0B0)"
                InputProps={{
                  endAdornment: <FormFieldValidation path={`${basePath}/powerline_symbol`} />
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Render content property groups */}
      {Object.entries(uiConfig.propertyGroups).map(([groupKey, group]) => {
        const groupProperties = uiConfig.properties.filter(
          p => group.properties.includes(p.name)
        );

        if (groupProperties.length === 0) return null;

        return (
          <Box key={groupKey} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {group.title}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {groupProperties.map((property) => (
                <Grid item xs={12} sm={6} key={property.name}>
                  <ControlFactory
                    property={property}
                    value={
                      property.name.includes('properties.')
                        ? segmentConfig.properties?.[property.name.replace('properties.', '')]
                        : segmentConfig[property.name]
                    }
                    onChange={(value) => {
                      if (property.name.includes('properties.')) {
                        const propName = property.name.replace('properties.', '');
                        const updatedProperties = {...(segmentConfig.properties || {}), [propName]: value};
                        handlePropertyChange('properties', updatedProperties);
                      } else {
                        handlePropertyChange(property.name, value);
                      }
                    }}
                    validationPath={`${basePath}/${property.name}`}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Paper>
  );
};

export default DynamicSegmentFactory;
