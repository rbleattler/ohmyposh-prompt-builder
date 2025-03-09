import { Segment } from '../../types/schema';


/**
 * Interface for the properties of the SegmentEditor component.
 */
export default interface SegmentEditorProps {
  segment: Segment;
  segmentIndex: number;
  blockIndex: number;
  onChange: (updatedSegment: Segment) => void;
  path: string; // Path to the segment in the schema
}
