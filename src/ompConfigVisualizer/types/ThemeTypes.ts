/**
 * This file contains shared type definitions for theme-related components
 */

// Define a type for the theme configuration
export interface ThemeConfig {
  $schema?: string;
  version?: number;
  final_space?: boolean;
  blocks?: Block[];
  console_title_template?: string;
  [key: string]: any; // Allow for additional properties
}

// Define a type for blocks
export interface Block {
  type: string;
  alignment?: 'left' | 'right';
  segments?: Segment[];
  newline?: boolean;
  [key: string]: any; // Allow for additional properties
}

// Define a type for segments
export interface Segment {
  type: string;
  style?: 'plain' | 'diamond' | 'powerline';
  foreground?: string;
  background?: string;
  properties?: Record<string, any>;
  [key: string]: any; // Allow for additional properties
}