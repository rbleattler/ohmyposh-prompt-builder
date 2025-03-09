import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Typography, Divider, Tabs, Tab, FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@mui/material';
import { Segment } from '../../types/schema';
import ColorPicker from '../editor/ColorPicker';
import { useValidation } from '../../contexts/ValidationContext';
import ValidationErrorDisplay from '../ValidationErrorDisplay';
import { SchemaControlMapper } from '../../utils/SchemaControlMapper';
import { useSchema } from '../../contexts/SchemaContext';

interface SegmentEditorProps {
  segment: Segment;
  onChange: (updatedSegment: Segment) => void;
  path: string;
}

const SegmentEditor: React.FC<SegmentEditorProps> = ({ segment, onChange, path }) => {
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { getValidationErrorsForPath } = useValidation();
  const { schema } = useSchema();

  // Initialize schema control mapper
  const schemaMapper = React.useMemo(() => {
    if (!schema) return null;
    return new SchemaControlMapper(schema);
  }, [schema]);

  useEffect(() => {
    // Map validation errors to form field errors
    const validationErrors = getValidationErrorsForPath(path);
    const fieldErrors: Record<string, string> = {};

    validationErrors.forEach(error => {
      const fieldPath = error.path.replace(`${path}/`, '');
      fieldErrors[fieldPath] = error.message;
    });

    setErrors(fieldErrors);
  }, [path, getValidationErrorsForPath]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAppearanceChange = (field: string, value: any) => {
    onChange({
      ...segment,
      [field]: value
    });
  };

  const handlePropertiesChange = (propertyName: string, value: any) => {
    onChange({
      ...segment,
      properties: {
        ...segment.properties,
        [propertyName]: value
      }
    });
  };

  const renderPropertyControls = () => {
    if (!schemaMapper || !segment.type) return null;

    // Get the schema definition for this segment type
    const segmentSchema = schemaMapper.getControlsForSegmentType(segment.type);

    if (!segmentSchema) {
      return (
        <Typography variant="body2" color="error">
          No schema available for segment type: {segment.type}
        </Typography>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {Object.entries(segmentSchema).map(([propName, controlConfig]) => {
            const propPath = `properties.${propName}`;
            const propValue = segment.properties?.[propName];
            const errorMessage = errors[propPath];

            switch (controlConfig.controlType) {
              case 'string':
                return (
                  <Grid item xs={12} md={6} key={propName}>
                    <TextField
                      fullWidth
                      label={controlConfig.props.label}
                      value={propValue || ''}
                      onChange={(e) => handlePropertiesChange(propName, e.target.value)}
                      margin="dense"
                      error={Boolean(errorMessage)}
                      helperText={errorMessage || controlConfig.props.description}
                    />
                  </Grid>
                );
              case 'number':
                return (
                  <Grid item xs={12} md={6} key={propName}>
                    <TextField
                      fullWidth
                      type="number"
                      label={controlConfig.props.label}
                      value={propValue || ''}
                      onChange={(e) => handlePropertiesChange(propName, e.target.value === '' ? '' : Number(e.target.value))}
                      margin="dense"
                      error={Boolean(errorMessage)}
                      helperText={errorMessage || controlConfig.props.description}
                      InputProps={{ inputProps: { min: controlConfig.props.min, max: controlConfig.props.max } }}
                    />
                  </Grid>
                );
              case 'boolean':
                return (
                  <Grid item xs={12} md={6} key={propName}>
                    <FormControl fullWidth margin="dense" error={Boolean(errorMessage)}>
                      <InputLabel id={`${propName}-label`}>{controlConfig.props.label}</InputLabel>
                      <Select
                        labelId={`${propName}-label`}
                        value={propValue === undefined ? 'unset' : propValue ? 'true' : 'false'}
                        onChange={(e) => {
                          const value = e.target.value;
                          handlePropertiesChange(propName, value === 'unset' ? undefined : value === 'true');
                        }}
                        label={controlConfig.props.label}
                      >
                        <MenuItem value="unset">Default</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                      <FormHelperText>{errorMessage || controlConfig.props.description}</FormHelperText>
                    </FormControl>
                  </Grid>
                );
              case 'enum':
                return (
                  <Grid item xs={12} md={6} key={propName}>
                    <FormControl fullWidth margin="dense" error={Boolean(errorMessage)}>
                      <InputLabel id={`${propName}-label`}>{controlConfig.props.label}</InputLabel>
                      <Select
                        labelId={`${propName}-label`}
                        value={propValue || ''}
                        onChange={(e) => handlePropertiesChange(propName, e.target.value)}
                        label={controlConfig.props.label}
                      >
                        {controlConfig.props.options?.map((option: string) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errorMessage || controlConfig.props.description}</FormHelperText>
                    </FormControl>
                  </Grid>
                );
              case 'color':
                return (
                  <Grid item xs={12} md={6} key={propName}>
                    <Typography variant="subtitle2" gutterBottom>{controlConfig.props.label}</Typography>
                    <ColorPicker
                      color={propValue || '#000000'}
                      onChange={(color) => handlePropertiesChange(propName, color)}
                      error={Boolean(errorMessage)}
                      helperText={errorMessage || controlConfig.props.description}
                    />
                  </Grid>
                );
              default:
                return (
                  <Grid item xs={12} key={propName}>
                    <Typography variant="body2">
                      Unsupported control type: {controlConfig.controlType} for {propName}
                    </Typography>
                  </Grid>
                );
            }
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <ValidationErrorDisplay path={path} />

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="segment editor tabs">
        <Tab label="Appearance" />
        <Tab label="Properties" />
      </Tabs>

      {/* Appearance Tab */}
      {tabValue === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Visual Appearance</Typography>

          <Grid container spacing={2}>
            {/* Type */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Type"
                value={segment.type || ''}
                disabled
                margin="dense"
                helperText="Segment type (read-only)"
              />
            </Grid>

            {/* Style */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Style"
                name="style"
                value={segment.style || 'powerline'}
                onChange={(e) => handleAppearanceChange('style', e.target.value)}
                margin="dense"
                error={Boolean(errors['style'])}
                helperText={errors['style'] || "Visual style of the segment"}
              >
                <MenuItem value="powerline">Powerline</MenuItem>
                <MenuItem value="plain">Plain</MenuItem>
                <MenuItem value="diamond">Diamond</MenuItem>
                <MenuItem value="pixel">Pixel</MenuItem>
              </TextField>
            </Grid>

            {/* Colors */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>Colors</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Foreground Color</Typography>
              <ColorPicker
                color={segment.foreground || '#ffffff'}
                onChange={(color) => handleAppearanceChange('foreground', color)}
                error={Boolean(errors['foreground'])}
                helperText={errors['foreground']}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Background Color</Typography>
              <ColorPicker
                color={segment.background || '#000000'}
                onChange={(color) => handleAppearanceChange('background', color)}
                error={Boolean(errors['background'])}
                helperText={errors['background']}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Properties Tab */}
      {tabValue === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Segment Properties</Typography>

          {!segment.properties && (
            <Typography variant="body2" color="text.secondary">
              This segment has no configurable properties.
            </Typography>
          )}

          {segment.properties && renderPropertyControls()}
        </Box>
      )}
    </Box>
  );
};

export default SegmentEditor;
