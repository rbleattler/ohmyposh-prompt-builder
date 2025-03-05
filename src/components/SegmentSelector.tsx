import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeBranch,
  faBatteryFull,
  faCloud,
  faTerminal,
  faFolder,
  faClock,
  faCog,
  faUser,
  faCode,
  faMusic // Fix: Import faMusic from solid icons
} from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

// Define all segment types in a central object
export const SEGMENT_TYPES = {
  // Core segment types
  OS: 'os',
  PATH: 'path',
  SHELL: 'shell',
  EXIT: 'exit',
  SESSION: 'session',
  // Additional segment types we implemented
  GIT: 'git',
  BATTERY: 'battery',
  WEATHER: 'weather',
  SPOTIFY: 'spotify',
  TIME: 'time',
  // Other segment types supported by oh-my-posh
  COMMAND: 'command',
  TEXT: 'text',
  SYSINFO: 'sysinfo',
  NODE: 'node',
  PYTHON: 'python',
  CUSTOM: 'custom'
};

interface SegmentSelectorProps {
  onSelect: (type: string) => void;
}

/**
 * Component to display and select available segment types
 */
const SegmentSelector: React.FC<SegmentSelectorProps> = ({ onSelect }) => {
  // Group segments by category for better organization
  const coreSegments = [
    {
      type: SEGMENT_TYPES.OS,
      name: 'Operating System',
      description: 'Show operating system icon or name',
      icon: <FontAwesomeIcon icon={faTerminal} />
    },
    {
      type: SEGMENT_TYPES.PATH,
      name: 'Path',
      description: 'Display current directory path',
      icon: <FontAwesomeIcon icon={faFolder} />
    },
    {
      type: SEGMENT_TYPES.SHELL,
      name: 'Shell',
      description: 'Show current shell information',
      icon: <FontAwesomeIcon icon={faTerminal} />
    },
    {
      type: SEGMENT_TYPES.EXIT,
      name: 'Exit Code',
      description: 'Display exit code of previous command',
      icon: <FontAwesomeIcon icon={faCode} />
    },
    {
      type: SEGMENT_TYPES.SESSION,
      name: 'Session',
      description: 'Show user and host information',
      icon: <FontAwesomeIcon icon={faUser} />
    }
  ];

  const additionalSegments = [
    {
      type: SEGMENT_TYPES.GIT,
      name: 'Git',
      description: 'Show git repository status',
      icon: <FontAwesomeIcon icon={faCodeBranch} />
    },
    {
      type: SEGMENT_TYPES.BATTERY,
      name: 'Battery',
      description: 'Display battery status and percentage',
      icon: <FontAwesomeIcon icon={faBatteryFull} />
    },
    {
      type: SEGMENT_TYPES.WEATHER,
      name: 'Weather',
      description: 'Show current weather conditions',
      icon: <FontAwesomeIcon icon={faCloud} />
    },
    {
      type: SEGMENT_TYPES.SPOTIFY,
      name: 'Spotify',
      description: 'Display currently playing music',
      icon: <FontAwesomeIcon icon={faSpotify} />
    },
    {
      type: SEGMENT_TYPES.TIME,
      name: 'Time & Date',
      description: 'Show current time and/or date',
      icon: <FontAwesomeIcon icon={faClock} />
    }
  ];

  const otherSegments = [
    {
      type: SEGMENT_TYPES.COMMAND,
      name: 'Command',
      description: 'Run and display output of a command',
      icon: <FontAwesomeIcon icon={faTerminal} />
    },
    {
      type: SEGMENT_TYPES.TEXT,
      name: 'Text',
      description: 'Display custom text',
      icon: <FontAwesomeIcon icon={faCode} />
    },
    {
      type: SEGMENT_TYPES.CUSTOM,
      name: 'Custom',
      description: 'Create a custom segment with templates',
      icon: <FontAwesomeIcon icon={faCog} />
    }
  ];

  const handleSelect = (type: string) => {
    onSelect(type);
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Add Segment</Typography>
        <Typography variant="body2" color="textSecondary">
          Select a segment type to add to your prompt
        </Typography>
      </Box>

      <Divider />

      <Typography variant="subtitle2" sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
        Core Segments
      </Typography>
      <List sx={{ py: 0 }}>
        {coreSegments.map((segment) => (
          <ListItem
            button
            key={segment.type}
            onClick={() => handleSelect(segment.type)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(66, 165, 245, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{segment.icon}</ListItemIcon>
            <ListItemText
              primary={segment.name}
              secondary={segment.description}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Typography variant="subtitle2" sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
        Additional Segments
      </Typography>
      <List sx={{ py: 0 }}>
        {additionalSegments.map((segment) => (
          <ListItem
            button
            key={segment.type}
            onClick={() => handleSelect(segment.type)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(66, 165, 245, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{segment.icon}</ListItemIcon>
            <ListItemText
              primary={segment.name}
              secondary={segment.description}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Typography variant="subtitle2" sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
        Other Segments
      </Typography>
      <List sx={{ py: 0 }}>
        {otherSegments.map((segment) => (
          <ListItem
            button
            key={segment.type}
            onClick={() => handleSelect(segment.type)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(66, 165, 245, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{segment.icon}</ListItemIcon>
            <ListItemText
              primary={segment.name}
              secondary={segment.description}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SegmentSelector;
