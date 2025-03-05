import { SegmentType } from '../components/types/SegmentProps';

/**
 * Configuration for a block in oh-my-posh prompt
 */
export interface BlockConfig {
  type?: string;
  alignment?: 'left' | 'right' | 'newline';
  segments?: SegmentType[];
  newline?: boolean;
  height?: number;
  vertical_offset?: number;
}
