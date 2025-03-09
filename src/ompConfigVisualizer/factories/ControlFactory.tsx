import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { PropertyDefinition, PropertyType } from '../utils/dynamicSegmentGenerator';
import { ColorPicker } from '../editor/ColorPicker';
import FormFieldValidation from '../editor/FormFieldValidation';
import IconPicker from '../editor/IconPicker';

interface ControlFactoryProps {
  property: PropertyDefinition;
  value: any;
  onChange: (value: any) => void;
  validationPath: string;
}

/**
 * Factory component that generates the appropriate UI control based on property type
 */
const ControlFactory: React.FC<ControlFactoryProps> = ({
  property,
  value,
  onChange,
  validationPath
}) => {
  const renderHelpTooltip = () => {
    if (!property.description) return null;

    return (
      <Tooltip title={property.description}>
        <IconButton size="small">
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  switch (property.type) {
    case PropertyType.STRING:
      return (
        <TextField
          fullWidth
          label={property.label}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          margin="dense"
          helperText={property.description}
          InputProps={{
            endAdornment: <FormFieldValidation path={validationPath} />
          }}
        />
      );

    case PropertyType.NUMBER:
      return (
        <TextField
          fullWidth
          label={property.label}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value === '' ? '' : Number(e.target.value);
            onChange(newValue);
          }}
          type="number"
          size="small"
          margin="dense"
          helperText={property.description}
          InputProps={{
            endAdornment: <FormFieldValidation path={validationPath} />,
            inputProps: {
              min: property.minimum,
              max: property.maximum
            }
          }}
        />
      );

    case PropertyType.BOOLEAN:
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
                size="small"
              />
            }
            label={property.label}
          />
          {renderHelpTooltip()}
          <FormFieldValidation path={validationPath} />
        </Box>
      );

    case PropertyType.ENUM:
      return (
        <FormControl fullWidth size="small" margin="dense">
          <InputLabel>{property.label}</InputLabel>
          <Select
            value={value || ''}
            label={property.label}
            onChange={(e) => onChange(e.target.value)}
            endAdornment={<FormFieldValidation path={validationPath} />}
          >
            {property.enumValues?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {property.description && (
            <FormHelperText>{property.description}</FormHelperText>
          )}
        </FormControl>
      );

    case PropertyType.COLOR:
      return (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              {property.label}
            </Typography>
            {renderHelpTooltip()}
            <FormFieldValidation path={validationPath} />
          </Box>
          <ColorPicker
            color={value || '#000000'}
            onChange={(color) => onChange(color)}
          />
        </Box>
      );

    case PropertyType.ICON:
      return (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              {property.label}
            </Typography>
            {renderHelpTooltip()}
            <FormFieldValidation path={validationPath} />
          </Box>
          <IconPicker
            value={value || ''}
            onChange={(icon) => onChange(icon)}
          />
          {property.description && (
            <Typography variant="caption" color="text.secondary">
              {property.description}
            </Typography>
          )}
        </Box>
      );

    default:
      return (
        <Typography variant="caption" color="error">
          Unsupported property type: {property.type}
        </Typography>
      );
  }
};

export default ControlFactory;
