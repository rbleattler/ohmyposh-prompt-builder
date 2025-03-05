// This file is auto-generated from the schema
// Do not modify this file directly

import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import FolderIcon from '@mui/icons-material/Folder';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ComputerIcon from '@mui/icons-material/Computer';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloudIcon from '@mui/icons-material/Cloud';
import ShieldIcon from '@mui/icons-material/Shield';
import DevicesIcon from '@mui/icons-material/Devices';
import MemoryIcon from '@mui/icons-material/Memory';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

// Define segment type with icons and descriptions
export interface SegmentTypeDefinition {
  type: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultProperties: Record<string, any>;
}

// Segment types extracted from schema
export const SEGMENT_TYPES: SegmentTypeDefinition[] = [
  {
    "type": "path",
    "name": "Path",
    "icon": null,
    "description": "Shows current directory path",
    "defaultProperties": {
      "style": "folder",
      "max_width": 0
    }
  },
  {
    "type": "git",
    "name": "Git",
    "icon": null,
    "description": "Shows Git repository information",
    "defaultProperties": {
      "branch_icon": "",
      "display_status": true
    }
  },
  {
    "type": "time",
    "name": "Time",
    "icon": null,
    "description": "Shows current time",
    "defaultProperties": {
      "format": "15:04:05"
    }
  },
  {
    "type": "battery",
    "name": "Battery",
    "icon": null,
    "description": "Shows battery status",
    "defaultProperties": {
      "display_charging": true
    }
  },
  {
    "type": "os",
    "name": "Os",
    "icon": null,
    "description": "Shows operating system information",
    "defaultProperties": {}
  },
  {
    "type": "text",
    "name": "Text",
    "icon": null,
    "description": "Shows static text",
    "defaultProperties": {
      "text": "Hello"
    }
  },
  {
    "type": "spotify",
    "name": "Spotify",
    "icon": null,
    "description": "Shows currently playing Spotify track",
    "defaultProperties": {}
  },
  {
    "type": "weather",
    "name": "Weather",
    "icon": null,
    "description": "Shows current weather",
    "defaultProperties": {}
  }
];

// Initialize icons for segment types
(() => {
  SEGMENT_TYPES[0].icon = React.createElement(FolderIcon);
  SEGMENT_TYPES[1].icon = React.createElement(GitHubIcon);
  SEGMENT_TYPES[2].icon = React.createElement(AccessTimeIcon);
  SEGMENT_TYPES[3].icon = React.createElement(BatteryChargingFullIcon);
  SEGMENT_TYPES[4].icon = React.createElement(ComputerIcon);
  SEGMENT_TYPES[5].icon = React.createElement(TextFieldsIcon);
  SEGMENT_TYPES[6].icon = React.createElement(MusicNoteIcon);
  SEGMENT_TYPES[7].icon = React.createElement(CloudIcon);
})();

/**
 * Get a segment type definition by type name
 */
export function getSegmentTypeDefinition(type: string): SegmentTypeDefinition | undefined {
  return SEGMENT_TYPES.find(def => def.type === type);
}

/**
 * Get all segment type names
 */
export function getSegmentTypeNames(): string[] {
  return SEGMENT_TYPES.map(def => def.type);
}

/**
 * Get the display name for a segment type
 */
export function getSegmentDisplayName(type: string): string {
  return getSegmentTypeDefinition(type)?.name || type;
}

/**
 * Get the default properties for a segment type
 */
export function getSegmentDefaultProperties(type: string): Record<string, any> {
  return getSegmentTypeDefinition(type)?.defaultProperties || {};
}