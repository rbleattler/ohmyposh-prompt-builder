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

  // Initialize config for Time segment
  const initializeTimeProperties = () => {
    const updatedConfig = {...safeConfig};

    // Initialize default values if they don't exist
    if (!updatedConfig.timeFormat) updatedConfig.timeFormat = "HH:mm:ss";
    if (!updatedConfig.dateFormat) updatedConfig.dateFormat = "MMM dd, yyyy";
    if (!updatedConfig.timezone) updatedConfig.timezone = "";

    // Initialize boolean flags
    if (updatedConfig.showTime === undefined) updatedConfig.showTime = true;
    if (updatedConfig.showDate === undefined) updatedConfig.showDate = false;
    if (updatedConfig.showIcons === undefined) updatedConfig.showIcons = true;

    return updatedConfig;
  };

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

  // Initialize battery segment properties
  const initializeBatteryProperties = () => {
    const updatedConfig = {...safeConfig};

    // Initialize default values
    if (updatedConfig.percentage === undefined) updatedConfig.percentage = 100;
    if (updatedConfig.charging === undefined) updatedConfig.charging = false;
    if (updatedConfig.showPercentage === undefined) updatedConfig.showPercentage = true;
    if (updatedConfig.lowThreshold === undefined) updatedConfig.lowThreshold = 20;
    if (updatedConfig.colorByPercentage === undefined) updatedConfig.colorByPercentage = true;

    return updatedConfig;
  };

  // Initialize weather segment properties
  const initializeWeatherProperties = () => {
    const updatedConfig = {...safeConfig};

    // Initialize default values
    if (!updatedConfig.condition) updatedConfig.condition = "Sunny";
    if (updatedConfig.temperature === undefined) updatedConfig.temperature = 22;
    if (!updatedConfig.unit) updatedConfig.unit = "C";
    if (!updatedConfig.city) updatedConfig.city = "New York";
    if (updatedConfig.showCity === undefined) updatedConfig.showCity = true;
    if (updatedConfig.showCondition === undefined) updatedConfig.showCondition = true;

    return updatedConfig;
  };

  // Initialize Spotify segment properties
  const initializeSpotifyProperties = () => {
    const updatedConfig = {...safeConfig};

    // Initialize default values
    if (!updatedConfig.songName) updatedConfig.songName = "Not playing";
    if (!updatedConfig.artist) updatedConfig.artist = "No artist";
    if (updatedConfig.playing === undefined) updatedConfig.playing = false;
    if (updatedConfig.maxLength === undefined) updatedConfig.maxLength = 20;
    if (updatedConfig.showIcon === undefined) updatedConfig.showIcon = true;
    if (updatedConfig.showPlayingStatus === undefined) updatedConfig.showPlayingStatus = true;
    if (updatedConfig.showArtist === undefined) updatedConfig.showArtist = true;
    if (updatedConfig.spotifySpecific === undefined) updatedConfig.spotifySpecific = true;

    return updatedConfig;
  };

  // Initialize Path segment properties
  const initializePathProperties = () => {
    const updatedConfig = {...safeConfig};

    // Initialize default values
    if (!updatedConfig.style) updatedConfig.style = "folder";
    if (!updatedConfig.folderIcon) updatedConfig.folderIcon = "\uf07b ";
    if (!updatedConfig.homeIcon) updatedConfig.homeIcon = "\uf7db ";
    if (!updatedConfig.folderSeparator) updatedConfig.folderSeparator = " \uf554 ";
    if (updatedConfig.maxDepth === undefined) updatedConfig.maxDepth = 3;
    if (updatedConfig.enableHyperlink === undefined) updatedConfig.enableHyperlink = true;

    return updatedConfig;
  };

  // Initialize Text segment properties
  const initializeTextProperties = () => {
    const updatedConfig = {...safeConfig};

    // Initialize default values
    if (!updatedConfig.text) updatedConfig.text = "";
    if (!updatedConfig.prefix) updatedConfig.prefix = "";
    if (!updatedConfig.suffix) updatedConfig.suffix = "";

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
      const batteryConfig = initializeBatteryProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            {createTextField('Battery Percentage', 'percentage', batteryConfig.percentage, 'number')}
            {createSwitch('Charging', 'charging', batteryConfig.charging)}
            {createSwitch('Show Percentage', 'showPercentage', batteryConfig.showPercentage)}
            {createTextField('Low Threshold', 'lowThreshold', batteryConfig.lowThreshold, 'number')}
            {createSwitch('Color by Percentage', 'colorByPercentage', batteryConfig.colorByPercentage)}
          </Grid>
        </>
      );

    case SEGMENT_TYPES.WEATHER:
      const weatherConfig = initializeWeatherProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Weather Condition', 'condition', weatherConfig.condition || 'Sunny')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Temperature', 'temperature', weatherConfig.temperature || 22, 'number')}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Temperature Unit', 'unit', weatherConfig.unit || 'C', 'text', [
                { value: 'C', label: 'Celsius (°C)' },
                { value: 'F', label: 'Fahrenheit (°F)' }
              ])}
            </Grid>
            <Grid item xs={12}>
              {createTextField('City', 'city', weatherConfig.city || 'New York')}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {createSwitch('Show City', 'showCity', weatherConfig.showCity !== false)}
                {createSwitch('Show Weather Condition', 'showCondition', weatherConfig.showCondition !== false)}
              </FormGroup>
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.SPOTIFY:
      const spotifyConfig = initializeSpotifyProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Song Name', 'songName', spotifyConfig.songName || 'Not playing')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Artist', 'artist', spotifyConfig.artist || 'No artist')}
            </Grid>
            <Grid item xs={6}>
              {createSwitch('Playing', 'playing', spotifyConfig.playing || false)}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Max Text Length', 'maxLength', spotifyConfig.maxLength || 20, 'number')}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {createSwitch('Show Icon', 'showIcon', spotifyConfig.showIcon !== false)}
                {createSwitch('Show Playing Status', 'showPlayingStatus', spotifyConfig.showPlayingStatus !== false)}
                {createSwitch('Show Artist', 'showArtist', spotifyConfig.showArtist !== false)}
                {createSwitch('Spotify Specific', 'spotifySpecific', spotifyConfig.spotifySpecific !== false)}
              </FormGroup>
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.TIME:
      const timeConfig = initializeTimeProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Time Format', 'timeFormat', timeConfig.timeFormat || 'HH:mm:ss')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Date Format', 'dateFormat', timeConfig.dateFormat || 'MMM dd, yyyy')}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Timezone', 'timezone', timeConfig.timezone || '')}
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                {createSwitch('Show Time', 'showTime', timeConfig.showTime !== false)}
                {createSwitch('Show Date', 'showDate', timeConfig.showDate !== false)}
                {createSwitch('Show Icons', 'showIcons', timeConfig.showIcons !== false)}
              </FormGroup>
            </Grid>
          </Grid>
        </>
      );

    case SEGMENT_TYPES.PATH:
      const pathConfig = initializePathProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Style', 'style', pathConfig.style, 'text', [
                { value: 'folder', label: 'Folder Name Only' },
                { value: 'full', label: 'Full Path' },
                { value: 'short', label: 'Shortened Path' }
              ])}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Folder Icon', 'folderIcon', pathConfig.folderIcon)}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Home Icon', 'homeIcon', pathConfig.homeIcon)}
            </Grid>
            <Grid item xs={12}>
              {createTextField('Folder Separator', 'folderSeparator', pathConfig.folderSeparator)}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Max Depth', 'maxDepth', pathConfig.maxDepth, 'number')}
            </Grid>
            <Grid item xs={6}>
              {createSwitch('Enable Hyperlink', 'enableHyperlink', pathConfig.enableHyperlink)}
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
      const textConfig = initializeTextProperties();
      return (
        <>
          <CommonConfigSection />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {createTextField('Text', 'text', textConfig.text)}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Prefix', 'prefix', textConfig.prefix)}
            </Grid>
            <Grid item xs={6}>
              {createTextField('Suffix', 'suffix', textConfig.suffix)}
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
