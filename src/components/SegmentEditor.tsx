import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  FormHelperText,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { ColorPicker } from './ColorPicker';
import { useValidation } from '../contexts/ValidationContext';
import FormFieldValidation from './FormFieldValidation';
import ValidationErrorDisplay from './ValidationErrorDisplay';

interface SegmentEditorProps {
  segment: any;
  segmentIndex: number;
  blockIndex: number;
  onChange: (updatedSegment: any) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab panel component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`segment-tabpanel-${index}`}
      aria-labelledby={`segment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const SegmentEditor: React.FC<SegmentEditorProps> = ({ segment, segmentIndex, blockIndex, onChange }) => {
  const { getErrorsForPath } = useValidation();
  const [tabValue, setTabValue] = useState(0);

  // Path to this segment for validation
  const segmentPath = `/blocks/${blockIndex}/segments/${segmentIndex}`;

  // Handle changes to segment properties
  const handleChange = (key: string, value: any) => {
    onChange({ ...segment, [key]: value });
  };

  // Handle changes to nested properties
  const handlePropertyChange = (key: string, value: any) => {
    const updatedProperties = { ...(segment.properties || {}), [key]: value };
    onChange({ ...segment, properties: updatedProperties });
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Get segment-specific properties based on type
  const renderSegmentTypeProperties = () => {
    switch (segment.type) {
      case 'path':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                size="small"
                error={!!getErrorsForPath(`${segmentPath}/properties/style`).length}
              >
                <InputLabel id="path-style-label">Path Style</InputLabel>
                <Select
                  labelId="path-style-label"
                  value={segment.properties?.style || ''}
                  label="Path Style"
                  onChange={(e) => handlePropertyChange('style', e.target.value)}
                  endAdornment={<FormFieldValidation path={`${segmentPath}/properties/style`} />}
                >
                  <MenuItem value="folder">Folder Name Only</MenuItem>
                  <MenuItem value="full">Full Path</MenuItem>
                  <MenuItem value="agnoster">Agnoster (Short)</MenuItem>
                  <MenuItem value="agnoster_full">Agnoster (Full)</MenuItem>
                  <MenuItem value="agnoster_short">Agnoster (Short + Tilde)</MenuItem>
                </Select>
                <FormHelperText>
                  How to display the current path
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Max Width"
                type="number"
                value={segment.properties?.max_width || ''}
                onChange={(e) => handlePropertyChange('max_width', parseInt(e.target.value) || '')}
                InputProps={{
                  endAdornment: <FormFieldValidation path={`${segmentPath}/properties/max_width`} />
                }}
                helperText="Maximum width of the path (0 for no limit)"
                error={!!getErrorsForPath(`${segmentPath}/properties/max_width`).length}
              />
            </Grid>
          </Grid>
        );
      case 'git':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Branch Icon"
                value={segment.properties?.branch_icon || ''}
                onChange={(e) => handlePropertyChange('branch_icon', e.target.value)}
                InputProps={{
                  endAdornment: <FormFieldValidation path={`${segmentPath}/properties/branch_icon`} />
                }}
                helperText="Icon to display before branch name"
                error={!!getErrorsForPath(`${segmentPath}/properties/branch_icon`).length}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                size="small"
                error={!!getErrorsForPath(`${segmentPath}/properties/display_status`).length}
              >
                <InputLabel id="git-status-label">Display Status</InputLabel>
                <Select
                  labelId="git-status-label"
                  value={segment.properties?.display_status === undefined ?
                    '' : segment.properties?.display_status ? 'true' : 'false'}
                  label="Display Status"
                  onChange={(e) => handlePropertyChange('display_status', e.target.value === 'true')}
                  endAdornment={<FormFieldValidation path={`${segmentPath}/properties/display_status`} />}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
                <FormHelperText>
                  Show changes, additions, deletions
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Configure segment-specific properties based on the type selected.
          </Typography>
        );
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Segment Editor: {segment.type || 'Unknown'} Segment
      </Typography>

      {/* Show validation errors for this segment */}
      <ValidationErrorDisplay path={segmentPath} />

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="segment editor tabs">
        <Tab label="Basic" />
        <Tab label="Style" />
        <Tab label="Properties" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              size="small"
              error={!!getErrorsForPath(`${segmentPath}/type`).length}
            >
              <InputLabel id="segment-type-label">Type</InputLabel>
              <Select
                labelId="segment-type-label"
                value={segment.type || ''}
                label="Type"
                onChange={(e) => handleChange('type', e.target.value)}
                endAdornment={<FormFieldValidation path={`${segmentPath}/type`} />}
              >
                <MenuItem value="path">Path</MenuItem>
                <MenuItem value="git">Git</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="time">Time</MenuItem>
                <MenuItem value="battery">Battery</MenuItem>
                <MenuItem value="os">Operating System</MenuItem>
              </Select>
              <FormHelperText>
                The type of information this segment displays
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              size="small"
              error={!!getErrorsForPath(`${segmentPath}/style`).length}
            >
              <InputLabel id="segment-style-label">Style</InputLabel>
              <Select
                labelId="segment-style-label"
                value={segment.style || ''}
                label="Style"
                onChange={(e) => handleChange('style', e.target.value)}
                endAdornment={<FormFieldValidation path={`${segmentPath}/style`} />}
              >
                <MenuItem value="plain">Plain</MenuItem>
                <MenuItem value="powerline">Powerline</MenuItem>
                <MenuItem value="diamond">Diamond</MenuItem>
              </Select>
              <FormHelperText>
                The visual style of the segment
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Foreground Color</Typography>
              <FormFieldValidation path={`${segmentPath}/foreground`} />
            </Box>
            <ColorPicker
              color={segment.foreground || '#ffffff'}
              onChange={(color) => handleChange('foreground', color)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Background Color</Typography>
              <FormFieldValidation path={`${segmentPath}/background`} />
            </Box>
            <ColorPicker
              color={segment.background || '#000000'}
              onChange={(color) => handleChange('background', color)}
            />
          </Grid>
          {segment.style === 'powerline' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Powerline Symbol"
                value={segment.powerline_symbol || ''}
                onChange={(e) => handleChange('powerline_symbol', e.target.value)}
                InputProps={{
                  endAdornment: <FormFieldValidation path={`${segmentPath}/powerline_symbol`} />
                }}
                helperText="The symbol to use for powerline segments (e.g. \uE0B0)"
                error={!!getErrorsForPath(`${segmentPath}/powerline_symbol`).length}
              />
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderSegmentTypeProperties()}
      </TabPanel>
    </Box>
  );
};

export default SegmentEditor;
