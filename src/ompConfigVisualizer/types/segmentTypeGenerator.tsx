import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
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
import React from 'react';

// Define segment type with icons and descriptions
export interface SegmentTypeDefinition {
  type: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultProperties: Record<string, any>;
}

// Icon mapping for segment types
const SEGMENT_ICONS: Record<string, React.ReactNode> = {
  path: <FolderIcon />,
  git: <GitHubIcon />,
  time: <AccessTimeIcon />,
  battery: <BatteryChargingFullIcon />,
  os: <ComputerIcon />,
  text: <TextFieldsIcon />,
  command: <TerminalIcon />,
  azure: <CloudIcon />,
  aws: <CloudIcon />,
  spotify: <MusicNoteIcon />,
  executiontime: <AccessTimeIcon />,
  root: <ShieldIcon />,
  node: <DevicesIcon />,
  java: <DevicesIcon />,
  python: <DevicesIcon />,
  ruby: <DevicesIcon />,
  golang: <DevicesIcon />,
  npm: <DevicesIcon />,
  rust: <DevicesIcon />,
  dotnet: <DevicesIcon />,
  kubectl: <DevicesIcon />,
  memory: <MemoryIcon />,
  // Add more mappings as needed
  default: <CodeIcon />
};

// Description mapping for segment types
const SEGMENT_DESCRIPTIONS: Record<string, string> = {
  path: 'Shows current directory path',
  git: 'Shows Git repository information',
  time: 'Shows current time',
  battery: 'Shows battery status',
  os: 'Shows operating system information',
  text: 'Shows static text',
  command: 'Executes and displays command output',
  azure: 'Shows Azure account information',
  aws: 'Shows AWS profile information',
  spotify: 'Shows currently playing Spotify track',
  executiontime: 'Shows command execution time',
  root: 'Shows a root/admin indicator',
  node: 'Shows Node.js version',
  java: 'Shows Java version',
  python: 'Shows Python version',
  ruby: 'Shows Ruby version',
  golang: 'Shows Go version',
  npm: 'Shows NPM package information',
  rust: 'Shows Rust version',
  dotnet: 'Shows .NET version',
  kubectl: 'Shows Kubernetes context',
  memory: 'Shows memory usage',
  // Add more descriptions as needed
  default: 'Configurable segment'
};

// Default properties mapping for segment types
const DEFAULT_PROPERTIES: Record<string, Record<string, any>> = {
  path: {
    style: 'folder',
    max_width: 0
  },
  git: {
    branch_icon: '',
    display_status: true
  },
  time: {
    format: '15:04:05'
  },
  battery: {
    display_charging: true
  },
  os: {},
  text: {
    text: 'Hello'
  },
  command: {
    command: 'echo Hello',
    shell: 'pwsh'
  },
  // Add more default properties as needed
  default: {}
};

/**
 * Load a schema from a file
 */
export async function loadSchema(): Promise<any> {
  try {
    const schemaPath = path.join(process.cwd(), 'src/schemas/schema.json');
    if (!fs.existsSync(schemaPath)) {
      console.warn('Schema file not found at', schemaPath);
      return null;
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error('Failed to load schema:', error);
    return null;
  }
}

/**
 * Extract segment types from the schema
 */
export async function extractSegmentTypesFromSchema(): Promise<string[]> {
  const schema = await loadSchema();
  if (!schema) {
    console.warn('Using fallback segment types - schema not available');
    return [
      'path', 'git', 'time', 'battery', 'os', 'text', 'command',
      'azure', 'aws', 'spotify', 'executiontime', 'exit'
    ];
  }

  try {
    // Look for segment type definitions in the schema
    const segmentDefinition = schema.definitions?.segment;
    if (!segmentDefinition || !segmentDefinition.properties || !segmentDefinition.properties.type) {
      throw new Error('Schema does not contain segment type definitions');
    }

    // Extract segment types from enum
    const typeEnums = segmentDefinition.properties.type.enum;
    if (!Array.isArray(typeEnums)) {
      throw new Error('Segment type enum is not an array');
    }

    return typeEnums;
  } catch (error) {
    console.error('Error extracting segment types:', error);
    // Fallback to default segment types
    return [
      'path', 'git', 'time', 'battery', 'os', 'text', 'command',
      'azure', 'aws', 'spotify', 'executiontime', 'exit'
    ];
  }
}

/**
 * Get a normalized name for a segment type
 */
function getNormalizedName(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
}

/**
 * Create segment type definitions from segment type names
 */
export async function generateSegmentTypeDefinitions(): Promise<SegmentTypeDefinition[]> {
  const segmentTypes = await extractSegmentTypesFromSchema();

  return segmentTypes.map(type => ({
    type,
    name: getNormalizedName(type),
    icon: SEGMENT_ICONS[type] || SEGMENT_ICONS.default,
    description: SEGMENT_DESCRIPTIONS[type] || SEGMENT_DESCRIPTIONS.default,
    defaultProperties: DEFAULT_PROPERTIES[type] || DEFAULT_PROPERTIES.default
  }));
}

/**
 * Generate a TypeScript file with segment type definitions
 */
export async function generateSegmentTypesFile(): Promise<void> {
  const segmentTypeDefinitions = await generateSegmentTypeDefinitions();

  const content = `/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the 'generate-schema-types' script to regenerate this file.
 *
 * Generated on: ${new Date().toISOString()}
 */

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
export const SEGMENT_TYPES: SegmentTypeDefinition[] = ${JSON.stringify(segmentTypeDefinitions, (key, value) => {
    if (key === 'icon') return '__ICON_PLACEHOLDER__'; // Placeholder for icons that can't be stringified
    return value;
  }, 2).replace(/"__ICON_PLACEHOLDER__"/g, 'null')};

// Replace icon placeholders with actual React components
${segmentTypeDefinitions.map((def, index) => {
  const iconComponent = getIconComponentName(def.type);
  return `SEGMENT_TYPES[${index}].icon = <${iconComponent} />;`;
}).join('\n')}

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
`;

  const outputPath = path.join(process.cwd(), 'src/generated/segmentTypes.tsx');
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, content);
  console.log(`Segment types file generated at ${outputPath}`);
}

// Helper function to get icon component name for a segment type
function getIconComponentName(type: string): string {
  switch (type) {
    case 'path': return 'FolderIcon';
    case 'git': return 'GitHubIcon';
    case 'time': return 'AccessTimeIcon';
    case 'battery': return 'BatteryChargingFullIcon';
    case 'os': return 'ComputerIcon';
    case 'text': return 'TextFieldsIcon';
    case 'command': return 'TerminalIcon';
    case 'azure':
    case 'aws': return 'CloudIcon';
    case 'spotify': return 'MusicNoteIcon';
    case 'executiontime': return 'AccessTimeIcon';
    case 'root': return 'ShieldIcon';
    case 'node':
    case 'java':
    case 'python':
    case 'ruby':
    case 'golang':
    case 'npm':
    case 'rust':
    case 'dotnet':
    case 'kubectl': return 'DevicesIcon';
    case 'memory': return 'MemoryIcon';
    default: return 'CodeIcon';
  }
}
