/**
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
  powerline_symbol?: string; // Add powerline_symbol property
}
