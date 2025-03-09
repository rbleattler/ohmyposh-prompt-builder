import { SegmentType } from './schema/segmentProps';

/**
 * Configuration for a block in oh-my-posh prompt
 */
export interface BlockConfig {
  type: string;
  alignment?: 'left' | 'right';
  segments?: SegmentType[];
  newline?: boolean;
  vertical?: boolean;
  overflow?: 'hide' | '';
  width?: number;
  height?: number;
  vertical_offset?: number;
}
