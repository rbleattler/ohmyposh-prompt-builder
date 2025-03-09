// export {};

const fs = require('fs');
const path = require('path');

// Directories to create
const dirs = [
  '../src/schemas',
  '../src/types/schema',
  '../src/services',
  '../src/defaults'
];

// Root directory for the paths
const rootDir = path.join(__dirname);

// Create directories if they don't exist
dirs.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${fullPath}`);
  }
});

// Create placeholder files if they don't exist
const placeholders = [
  {
    path: '../src/types/schema/block.ts',
    content: `/**
 * Block interface placeholder until the schema generation creates this file
 * This file will be overwritten by the schema generation script
 */

// A minimal Block interface to prevent build errors
export interface Block {
  type: string;
  alignment?: 'left' | 'right';
  segments?: any[];
  newline?: boolean;
}
`
  },
  {
    path: '../src/types/schema/segment.ts',
    content: `/**
 * Segment interface placeholder until the schema generation creates this file
 * This file will be overwritten by the schema generation script
 */

// A minimal Segment interface to prevent build errors
export interface Segment {
  type: string;
  style?: 'plain' | 'diamond' | 'powerline';
  foreground?: string;
  background?: string;
  properties?: Record<string, any>;
}
`
  }
];

// Create placeholder files if they don't exist
placeholders.forEach(file => {
  const filePath = path.join(rootDir, file.path);
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder file: ${filePath}`);
    fs.writeFileSync(filePath, file.content);
  } else {
    console.log(`Placeholder file already exists: ${filePath}`);
  }
});

console.log('Schema directory structure initialized successfully.');
