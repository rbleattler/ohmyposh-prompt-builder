import React from 'react';
import { SEGMENT_TYPES } from './SegmentSelector';
import GitSegmentConfig from './config-forms/GitSegmentConfig';
import {
  TextField,
  Grid,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Box
} from '@mui/material';
import { SketchPicker } from 'react-color';

// Import other config components as needed

interface SegmentConfigFactoryProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

/**
 * Factory component to render appropriate configuration form based on segment type
 */
const SegmentConfigFactory: React.FC<SegmentConfigFactoryProps> = ({
  type,
  config,
  onChange,
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange
}) => {
  // Make sure config is always initialized properly
  const safeConfig = config || {};

  // Ensure properties object exists to prevent null/undefined errors
  const ensureProperties = () => {
    if (!safeConfig.properties) {
      safeConfig.properties = {};
    }
    return safeConfig;
  };

  // Common configuration form for all segment types with color pickers
  const CommonConfigSection = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Segment Appearance</Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body2" gutterBottom>Foreground Color</Typography>
        <Box sx={{
          p: 1,
          border: '1px solid #555',
          borderRadius: 1,
          display: 'inline-block',
          bgcolor: foreground,
          cursor: 'pointer',
          width: '100%',
          height: '2rem'
        }}>
          <SketchPicker
            color={foreground}
            onChange={(color) => onForegroundChange(color.hex)}
            disableAlpha
          />
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="body2" gutterBottom>Background Color</Typography>
        <Box sx={{
          p: 1,
          border: '1px solid #555',
          borderRadius: 1,
          display: 'inline-block',
          bgcolor: background,
          cursor: 'pointer',
          width: '100%',
          height: '2rem'
        }}>
          <SketchPicker
            color={background}
            onChange={(color) => onBackgroundChange(color.hex)}
            disableAlpha
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Segment Configuration</Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
    </Grid>
  );

  // Helper for creating text field configs
  const createTextField = (
    label: string,
    key: string,
    value: any,
    type: string = 'text',
    options?: any[]
  ) => {
    if (options) {
      return (
        <TextField
          fullWidth
          select
          label={label}
          value={value || ''}
          onChange={(e) => onChange({ ...config, [key]: e.target.value })}
          variant="outlined"
          size="small"
          margin="normal"
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        fullWidth
        label={label}
        value={value || ''}
        onChange={(e) => onChange({ ...config, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        variant="outlined"
        type={type}
        size="small"
        margin="normal"
      />
    );
  };

  // Helper for creating switch configs
  const createSwitch = (label: string, key: string, checked: boolean) => (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(e) => onChange({ ...config, [key]: e.target.checked })}
        />
      }
      label={label}
    />
  );

  // Initialize config.properties for OS segment
  const initializeOsProperties = () => {
    const updatedConfig = ensureProperties();
    // Initialize with default values if they don't exist
    if (!updatedConfig.properties.windows) updatedConfig.properties.windows = "\uf871 ";
    if (!updatedConfig.properties.macos) updatedConfig.properties.macos = "\uf179 ";
    if (!updatedConfig.properties.linux) updatedConfig.properties.linux = "\uf17c ";
    if (!updatedConfig.properties.ubuntu) updatedConfig.properties.ubuntu = "\uf31b ";

    return updatedConfig;
  };

  // Render specific configuration form based on segment type
  switch (type) {
    case SEGMENT_TYPES.GIT:
      return (
        <>
          <CommonConfigSection />
          <GitSegmentConfig config={safeConfig} onChange={onChange} />
        </>
      );

    case SEGMENT_TYPES.BATTERY:
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            {createTextField('Battery Percentage', 'percentage', config.percentage, 'number')}
            {createSwitch('Charging', 'charging', config.charging || false)}
            {createSwitch('Show Percentage', 'showPercentage', config.showPercentage !== false)}
            {createTextField('Low Threshold', 'lowThreshold', config.lowThreshold || 20, 'number')}
            {createSwitch('Color by Percentage', 'colorByPercentage', config.colorByPercentage !== false)}
          </Grid>
        </>
      );

    case SEGMENT_TYPES.WEATHER:
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Weather Condition', 'condition', config.condition || 'Sunny')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Temperature', 'temperature', config.temperature || 22, 'number')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Temperature Unit', 'unit', config.unit || 'C', 'text', [
                { value: 'C', label: 'Celsius (°C)' },
                { value: 'F', label: 'Fahrenheit (°F)' }
              ])}
            </Grid>
            <Grid item xs={12}>
              {createTextField('City', 'city', config.city || 'New York')}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {createSwitch('Show City', 'showCity', config.showCity !== false)}
                {createSwitch('Show Weather Condition', 'showCondition', config.showCondition !== false)}
              </FormGroup>
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.SPOTIFY:
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Song Name', 'songName', config.songName || 'Not playing')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Artist', 'artist', config.artist || 'No artist')}
            </Grid>
            <Grid item xs={6}>
              {createSwitch('Playing', 'playing', config.playing || false)}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Max Text Length', 'maxLength', config.maxLength || 20, 'number')}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {createSwitch('Show Icon', 'showIcon', config.showIcon !== false)}
                {createSwitch('Show Playing Status', 'showPlayingStatus', config.showPlayingStatus !== false)}
                {createSwitch('Show Artist', 'showArtist', config.showArtist !== false)}
                {createSwitch('Spotify Specific', 'spotifySpecific', config.spotifySpecific !== false)}
              </FormGroup>
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.TIME:
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Time Format', 'timeFormat', config.timeFormat || 'HH:mm:ss')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Date Format', 'dateFormat', config.dateFormat || 'MMM dd, yyyy')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Timezone', 'timezone', config.timezone || '')}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {createSwitch('Show Time', 'showTime', config.showTime !== false)}
                {createSwitch('Show Date', 'showDate', config.showDate !== false)}
                {createSwitch('Show Icons', 'showIcons', config.showIcons !== false)}
              </FormGroup>
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.PATH:
      ensureProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Style', 'style', config.style || 'folder', 'text', [
                { value: 'folder', label: 'Folder Name Only' },
                { value: 'full', label: 'Full Path' },
                { value: 'short', label: 'Shortened Path' }
              ])}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Folder Icon', 'folderIcon', config.folderIcon || '\uf07b ')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Home Icon', 'homeIcon', config.homeIcon || '\uf7db ')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Folder Separator', 'folderSeparator', config.folderSeparator || ' \uf554 ')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Max Depth', 'maxDepth', config.maxDepth || 3, 'number')}
            </Grid>
            <Grid item xs={6}>
              {createSwitch('Enable Hyperlink', 'enableHyperlink', config.enableHyperlink !== false)}
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.OS:
      const osConfig = initializeOsProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {createTextField('Windows Icon', 'properties.windows', osConfig.properties.windows || '\uf871 ')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('MacOS Icon', 'properties.macos', osConfig.properties.macos || '\uf179 ')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Linux Icon', 'properties.linux', osConfig.properties.linux || '\uf17c ')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Ubuntu Icon', 'properties.ubuntu', osConfig.properties.ubuntu || '\uf31b ')}
            </Grid>
            <Grid item xs={12}>
              {createSwitch('Show Always', 'properties.showAlways', osConfig.properties.showAlways !== false)}
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.TEXT:
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Text', 'text', config.text || '')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Prefix', 'prefix', config.prefix || '')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Suffix', 'suffix', config.suffix || '')}
            </Grid>
          </Grid>
        </>
      );

    default:
      // Default configuration form for unimplemented segment types
      return (
        <>
          <CommonConfigSection />
          <Typography variant="body1" color="textSecondary" textAlign="center" sx={{ py: 2 }}>
            Basic configuration options for {type} segment.
            Additional options will be available soon.
          </Typography>
        </>
      );
  }
};

export default SegmentConfigFactory;
