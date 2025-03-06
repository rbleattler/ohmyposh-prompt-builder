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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  List,
  ListItem,
  Paper,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { PropertyType } from '../../utils/dynamicSegmentGenerator';
import { ColorPicker } from '../editor/ColorPicker';
import FormFieldValidation from '../editor/FormFieldValidation';
import IconPicker from '../editor/IconPicker';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SchemaControlMapper } from '../../utils/SchemaControlMapper';

interface SchemaControlFactoryProps {
  schema: any;
  propertyName: string;
  propertySchema: any;
  value: any;
  onChange: (value: any) => void;
  validationPath: string;
  required?: boolean;
}

/**
 * Enhanced schema-based control factory
 */
const SchemaControlFactory: React.FC<SchemaControlFactoryProps> = ({
  schema,
  propertyName,
  propertySchema,
  value,
  onChange,
  validationPath,
  required = false,
}) => {
  // Create a SchemaControlMapper instance to map schema to UI controls
  const mapper = React.useMemo(() =>
    new SchemaControlMapper(schema), [schema]
  );

  // Map the schema to a property definition and control config
  const { propertyDef } = React.useMemo(() =>
    mapper.mapPropertyToControl(propertyName, propertySchema, required),
    [mapper, propertyName, propertySchema, required]
  );

  const renderHelpTooltip = () => {
    if (!propertyDef.description) return null;

    return (
      <Tooltip title={propertyDef.description}>
        <IconButton size="small">
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  // Helper function to render controls based on property type
  const renderControl = () => {
    switch (propertyDef.type) {
      case PropertyType.STRING:
        return (
          <TextField
            fullWidth
            label={propertyDef.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            margin="dense"
            helperText={propertyDef.description}
            required={propertyDef.required}
            InputProps={{
              endAdornment: <FormFieldValidation path={validationPath} />
            }}
            inputProps={{
              pattern: propertyDef.pattern,
            }}
          />
        );

      case PropertyType.NUMBER:
        return (
          <TextField
            fullWidth
            label={propertyDef.label}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value === '' ? '' : Number(e.target.value);
              onChange(newValue);
            }}
            type="number"
            size="small"
            margin="dense"
            helperText={propertyDef.description}
            required={propertyDef.required}
            InputProps={{
              endAdornment: <FormFieldValidation path={validationPath} />,
              inputProps: {
                min: propertyDef.minimum,
                max: propertyDef.maximum
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
              label={propertyDef.label}
            />
            {renderHelpTooltip()}
            <FormFieldValidation path={validationPath} />
          </Box>
        );

      case PropertyType.ENUM:
        return (
          <FormControl fullWidth size="small" margin="dense" required={propertyDef.required}>
            <InputLabel>{propertyDef.label}</InputLabel>
            <Select
              value={value || ''}
              label={propertyDef.label}
              onChange={(e) => onChange(e.target.value)}
              endAdornment={<FormFieldValidation path={validationPath} />}
            >
              {propertyDef.enumValues?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {propertyDef.description && (
              <FormHelperText>{propertyDef.description}</FormHelperText>
            )}
          </FormControl>
        );

      case PropertyType.COLOR:
        return (
          <Box sx={{ mt: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ mr: 1 }}>
                {propertyDef.label}
                {propertyDef.required && <span style={{ color: 'red' }}> *</span>}
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
                {propertyDef.label}
                {propertyDef.required && <span style={{ color: 'red' }}> *</span>}
              </Typography>
              {renderHelpTooltip()}
              <FormFieldValidation path={validationPath} />
            </Box>
            <IconPicker
              value={value || ''}
              onChange={(icon) => onChange(icon)}
            />
            {propertyDef.description && (
              <Typography variant="caption" color="text.secondary">
                {propertyDef.description}
              </Typography>
            )}
          </Box>
        );

      case PropertyType.OBJECT:
        return renderObjectControl();

      case PropertyType.ARRAY:
        return renderArrayControl();

      default:
        return (
          <Typography variant="caption" color="error">
            Unsupported property type: {propertyDef.type}
          </Typography>
        );
    }
  };

  // Render nested object properties
  const renderObjectControl = () => {
    if (!propertyDef.children || propertyDef.children.length === 0) {
      return (
        <Typography variant="caption" color="text.secondary">
          No editable properties for this object
        </Typography>
      );
    }

    const currentValue = value || {};

    return (
      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{propertyDef.label}</Typography>
          {propertyDef.required && <Typography color="error" sx={{ ml: 1 }}>*</Typography>}
          <FormFieldValidation path={validationPath} />
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {propertyDef.description && (
              <Typography variant="caption" color="text.secondary" paragraph>
                {propertyDef.description}
              </Typography>
            )}

            {propertyDef.children.map((childProp) => (
              <Box key={childProp.name} sx={{ mb: 2 }}>
                <SchemaControlFactory
                  schema={schema}
                  propertyName={childProp.name}
                  propertySchema={{
                    type: childProp.type,
                    description: childProp.description,
                    default: childProp.defaultValue,
                    // Add other properties as needed
                  }}
                  value={currentValue[childProp.name]}
                  onChange={(newValue) => {
                    onChange({
                      ...currentValue,
                      [childProp.name]: newValue
                    });
                  }}
                  validationPath={`${validationPath}.${childProp.name}`}
                  required={childProp.required}
                />
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  // Render array items with add/remove/reorder functionality
  const renderArrayControl = () => {
    const itemType = propertyDef.itemType;
    if (!itemType) {
      return (
        <Typography variant="caption" color="error">
          Array item type not defined
        </Typography>
      );
    }

    const items = Array.isArray(value) ? value : [];

    const handleAdd = () => {
      onChange([...items, itemType.defaultValue]);
    };

    const handleRemove = (index: number) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    };

    const handleItemChange = (index: number, newValue: any) => {
      const newItems = [...items];
      newItems[index] = newValue;
      onChange(newItems);
    };

    const onDragEnd = (result: any) => {
      if (!result.destination) return;

      const reorderedItems = Array.from(items);
      const [removed] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, removed);

      onChange(reorderedItems);
    };

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">
            {propertyDef.label}
            {propertyDef.required && <span style={{ color: 'red' }}> *</span>}
          </Typography>
          <Button
            startIcon={<AddIcon />}
            size="small"
            onClick={handleAdd}
            variant="outlined"
          >
            Add Item
          </Button>
        </Box>

        {propertyDef.description && (
          <Typography variant="caption" color="text.secondary" paragraph>
            {propertyDef.description}
          </Typography>
        )}

        <FormFieldValidation path={validationPath} />

        {items.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            No items added yet
          </Typography>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="array-items">
              {(provided) => (
                <Paper
                  sx={{ p: 1, mt: 1 }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <List dense disablePadding>
                    {items.map((item, index) => (
                      <Draggable key={index} draggableId={`item-${index}`} index={index}>
                        {(provided) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              mb: 1,
                              border: '1px solid #e0e0e0',
                              borderRadius: 1
                            }}
                          >
                            <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                              <DragIndicatorIcon fontSize="small" />
                            </Box>

                            <Box sx={{ flexGrow: 1 }}>
                              <SchemaControlFactory
                                schema={schema}
                                propertyName={`${propertyName}[${index}]`}
                                propertySchema={{
                                  type: itemType.type,
                                  description: itemType.description,
                                  default: itemType.defaultValue,
                                  enum: itemType.enumValues?.map(e => e.value),
                                  // Add other properties as needed
                                }}
                                value={item}
                                onChange={(newValue) => handleItemChange(index, newValue)}
                                validationPath={`${validationPath}[{index}]`}
                              />
                            </Box>

                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => handleRemove(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                </Paper>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>
    );
  };

  // Special handling for format-specific controls
  if (propertyDef.format) {
    switch (propertyDef.format) {
      case 'date':
      case 'date-time':
      case 'time':
        // TODO: Implement date/time picker controls
        break;
      case 'email':
        return (
          <TextField
            fullWidth
            label={propertyDef.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            margin="dense"
            helperText={propertyDef.description}
            required={propertyDef.required}
            type="email"
            InputProps={{
              endAdornment: <FormFieldValidation path={validationPath} />
            }}
          />
        );
      case 'uri':
        return (
          <TextField
            fullWidth
            label={propertyDef.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            margin="dense"
            helperText={propertyDef.description}
            required={propertyDef.required}
            type="url"
            InputProps={{
              endAdornment: <FormFieldValidation path={validationPath} />
            }}
          />
        );
    }
  }

  return renderControl();
};

export default SchemaControlFactory;