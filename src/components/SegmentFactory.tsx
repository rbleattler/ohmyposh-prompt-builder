import React from 'react';
import { SEGMENT_TYPES } from './SegmentSelector';
import GitSegment from './segments/GitSegment';
import BatterySegment from './segments/BatterySegment';
import WeatherSegment from './segments/WeatherSegment';
import SpotifySegment from './segments/SpotifySegment';
import TimeSegment from './segments/TimeSegment';
import { Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWindows,
  faApple,
  faLinux,
  faUbuntu
} from '@fortawesome/free-brands-svg-icons';
import {
  faFolder,
  faTerminal,
  faExclamationCircle,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';

interface SegmentFactoryProps {
  type: string;
  config?: any;
  foreground: string;
  background: string;
  style?: string;
}

/**
 * Factory component to render appropriate segment based on type
 */
const SegmentFactory: React.FC<SegmentFactoryProps> = ({
  type,
  config = {},
  foreground,
  background,
  style
}) => {
  // Common style wrapper for all segments
  const containerStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: background,
    color: foreground,
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'monospace',
    minHeight: '2rem'
  };

  // Use a switch to render the appropriate segment component
  switch (type) {
    case SEGMENT_TYPES.GIT:
      return <GitSegment config={config} foreground={foreground} background={background} />;

    case SEGMENT_TYPES.BATTERY:
      return <BatterySegment config={config} foreground={foreground} background={background} />;

    case SEGMENT_TYPES.WEATHER:
      return <WeatherSegment config={config} foreground={foreground} background={background} />;

    case SEGMENT_TYPES.SPOTIFY:
      return <SpotifySegment config={config} foreground={foreground} background={background} />;

    case SEGMENT_TYPES.TIME:
      return <TimeSegment config={config} foreground={foreground} background={background} />;

    case SEGMENT_TYPES.OS:
      return (
        <Box sx={containerStyle}>
          {config.windows && <FontAwesomeIcon icon={faWindows} title="Windows" />}
          {config.macos && <FontAwesomeIcon icon={faApple} title="MacOS" />}
          {config.linux && <FontAwesomeIcon icon={faLinux} title="Linux" />}
          {config.ubuntu && <FontAwesomeIcon icon={faUbuntu} title="Ubuntu" />}
          {!config.windows && !config.macos && !config.linux && !config.ubuntu && (
            <FontAwesomeIcon icon={faWindows} title="Default: Windows" />
          )}
        </Box>
      );

    case SEGMENT_TYPES.PATH:
      return (
        <Box sx={containerStyle}>
          <FontAwesomeIcon icon={faFolder} style={{ marginRight: '0.5rem' }} />
          <Typography variant="body2" component="span">
            {config.path || '~/projects/oh-my-posh'}
          </Typography>
        </Box>
      );

    case SEGMENT_TYPES.SHELL:
      return (
        <Box sx={containerStyle}>
          <FontAwesomeIcon icon={faTerminal} style={{ marginRight: '0.5rem' }} />
          <Typography variant="body2" component="span">
            {config.shell || 'pwsh'}
          </Typography>
        </Box>
      );

    case SEGMENT_TYPES.EXIT:
      return (
        <Box sx={containerStyle}>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{
              marginRight: '0.5rem',
              color: config.code && config.code !== 0 ? '#e74c3c' : '#2ecc71'
            }}
          />
          <Typography variant="body2" component="span">
            {config.code || 0}
          </Typography>
        </Box>
      );

    case SEGMENT_TYPES.SESSION:
      return (
        <Box sx={containerStyle}>
          <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
          <Typography variant="body2" component="span">
            {config.user || 'user'}
            {config.host && '@' + config.host}
          </Typography>
        </Box>
      );

    case SEGMENT_TYPES.TEXT:
      return (
        <Box sx={containerStyle}>
          {config.prefix && (
            <Typography variant="body2" component="span" sx={{ mr: 0.5 }}>
              {config.prefix}
            </Typography>
          )}
          <Typography variant="body2" component="span">
            {config.text || 'Sample Text'}
          </Typography>
          {config.suffix && (
            <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
              {config.suffix}
            </Typography>
          )}
        </Box>
      );

    default:
      // Fallback for unimplemented segment types
      return (
        <Box sx={containerStyle}>
          <Typography variant="body2" component="span">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Typography>
        </Box>
      );
  }
};

export default SegmentFactory;
