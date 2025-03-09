import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
// Import from the actual location of segmentTypes module
import { getSegmentDisplayName } from '../../generated/segmentTypes';
// Import from the actual location of IconRenderer component
import IconRenderer from '../IconRenderer';

interface DynamicSegmentFactoryProps {
  type: string;
  config: any;
  foreground: string;
  background: string;
  style?: string;
  schema: any;
}

/**
 * A factory component that dynamically renders segment visualizations based on schema definitions
 * This replaces the hardcoded SegmentFactory approach with a dynamic schema-based approach
 */
const DynamicSegmentFactory: React.FC<DynamicSegmentFactoryProps> = ({
  type,
  config,
  foreground,
  background,
  schema
}) => {
  // Common style wrapper for all segments
  const containerStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: background,
    color: foreground,
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'monospace',
    minHeight: '2rem',
  };

  // Use the schema to determine segment visualization
  const segmentDisplay = useMemo(() => {
    if (!schema) {
      return (
        <Typography variant="body2" component="span">
          {getSegmentDisplayName(type)}
        </Typography>
      );
    }

    // Try to find the segment definition in the schema
    const segmentDef = findSegmentInSchema(schema, type);

    if (!segmentDef) {
      return (
        <Typography variant="body2" component="span">
          {getSegmentDisplayName(type)}
        </Typography>
      );
    }

    // Special handling for different segment types
    switch (type) {
      case 'git':
        return (
          <>
            {config.properties?.branch_icon && (
              <Typography component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>
                {config.properties.branch_icon}
              </Typography>
            )}
            <Typography variant="body2" component="span">
              main
            </Typography>
            {config.properties?.display_status && (
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                +2 ~1 -0
              </Typography>
            )}
          </>
        );

      case 'path':
        return (
          <>
            {config.folderIcon && (
              <Typography component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>
                {config.folderIcon}
              </Typography>
            )}
            <Typography variant="body2" component="span">
              {renderPathPreview(config)}
            </Typography>
          </>
        );

      case 'battery':
        return (
          <>
            <Typography component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>
              {getBatteryIcon(config.percentage, config.charging)}
            </Typography>
            {config.showPercentage && (
              <Typography variant="body2" component="span">
                {config.percentage || 100}%
              </Typography>
            )}
          </>
        );

      case 'os':
        return (
          <>
            <IconRenderer iconValue={getOsIcon(config)} />
          </>
        );

      case 'time':
        return (
          <>
            {config.showIcons && (
              <Typography component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>
                {config.showDate ? '📅' : '⏰'}
              </Typography>
            )}
            <Typography variant="body2" component="span">
              {renderTimePreview(config)}
            </Typography>
          </>
        );

      case 'text':
        return (
          <>
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
          </>
        );

      case 'spotify':
        return (
          <>
            {config.showIcon && (
              <Typography component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>
                {config.playing ? '▶️' : '⏸️'}
              </Typography>
            )}
            <Typography variant="body2" component="span">
              {config.songName || 'Not playing'}
              {config.showArtist && config.artist && (
                <Typography variant="body2" component="span" sx={{ ml: 0.5, opacity: 0.8 }}>
                  - {config.artist}
                </Typography>
              )}
            </Typography>
          </>
        );

      case 'weather':
        return (
          <>
            <Typography component="span" sx={{ mr: 0.5, fontSize: '1rem' }}>
              {getWeatherIcon(config.condition)}
            </Typography>
            <Typography variant="body2" component="span">
              {config.temperature || 22}°{config.unit || 'C'}
              {config.showCity && config.city && (
                <Typography variant="body2" component="span" sx={{ ml: 0.5, opacity: 0.8 }}>
                  ({config.city})
                </Typography>
              )}
            </Typography>
          </>
        );

      default:
        // For any other segment type, just display the name
        return (
          <Typography variant="body2" component="span">
            {getSegmentDisplayName(type)}
          </Typography>
        );
    }
  }, [type, config, schema]);

  return <Box sx={containerStyle}>{segmentDisplay}</Box>;
};

// Helper function to find a segment definition in the schema
const findSegmentInSchema = (schema: any, segmentType: string) => {
  if (!schema || !schema.definitions) return null;

  // Look for segment definitions
  const segmentDef = schema.definitions.segment;
  if (!segmentDef) return null;

  // Look for the specific segment type
  for (const key in schema.definitions) {
    if (key.toLowerCase().includes(segmentType.toLowerCase())) {
      return schema.definitions[key];
    }
  }

  return null;
};

// Helper function to render path preview
const renderPathPreview = (config: any) => {
  const style = config.style || 'folder';

  switch (style) {
    case 'folder':
      return 'oh-my-posh';
    case 'full':
      return '/Users/username/projects/oh-my-posh';
    case 'short':
      return '~/p/oh-my-posh';
    default:
      return 'oh-my-posh';
  }
};

// Helper function to get battery icon based on percentage and charging state
const getBatteryIcon = (percentage: number = 100, charging: boolean = false) => {
  if (charging) {
    return '🔌';
  }

  if (percentage <= 10) {
    return '🪫';
  } else if (percentage <= 25) {
    return '🔋';
  } else if (percentage <= 50) {
    return '🔋';
  } else if (percentage <= 75) {
    return '🔋';
  } else {
    return '🔋';
  }
};

// Helper function to get OS icon
const getOsIcon = (config: any) => {
  if (config.properties?.windows) return config.properties.windows;
  if (config.properties?.macos) return config.properties.macos;
  if (config.properties?.linux) return config.properties.linux;
  if (config.properties?.ubuntu) return config.properties.ubuntu;

  return '\uf17a'; // Default Windows icon
};

// Helper function to get weather icon based on condition
const getWeatherIcon = (condition: string = 'Sunny') => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
    return '☀️';
  } else if (conditionLower.includes('cloud')) {
    return '☁️';
  } else if (conditionLower.includes('rain')) {
    return '🌧️';
  } else if (conditionLower.includes('snow')) {
    return '❄️';
  } else {
    return '🌤️';
  }
};

// Helper function to render time preview
const renderTimePreview = (config: any) => {
  const now = new Date();

  let result = '';

  if (config.showTime !== false) {
    // Format: HH:mm:ss
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    result += `${hours}:${minutes}:${seconds}`;
  }

  if (config.showDate) {
    // Format: MMM dd, yyyy
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();

    if (result) result += ' ';
    result += `${month} ${day}, ${year}`;
  }

  return result || 'HH:mm:ss';
};

export default DynamicSegmentFactory;
