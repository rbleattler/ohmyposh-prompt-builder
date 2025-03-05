/**
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
