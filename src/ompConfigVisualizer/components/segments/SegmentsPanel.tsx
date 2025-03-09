import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SegmentType } from '../../types/schema/segmentProps';
import DraggableSegmentItem from './DraggableSegmentItem';

interface SegmentsPanelProps {
  /**
   * Array of segments to display
   */
  segments: SegmentType[];
  /**
   * Currently selected segment index
   */
  selectedSegmentIndex: number | null;
  /**
   * Handler for selecting a segment
   */
  onSelectSegment: (index: number) => void;
  /**
   * Handler for deleting a segment
   */
  onDeleteSegment: (index: number) => void;
  /**
   * Handler for moving segments (reordering)
   */
  onMoveSegment: (dragIndex: number, hoverIndex: number) => void;
  /**
   * Handler for adding a new segment
   */
  onAddSegment: () => void;
}

/**
 * Panel component that displays and manages a list of segments
 */
const SegmentsPanel: React.FC<SegmentsPanelProps> = ({
  segments,
  selectedSegmentIndex,
  onSelectSegment,
  onDeleteSegment,
  onMoveSegment,
  onAddSegment
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Segments</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddSegment}
          size="small"
        >
          Add
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {segments.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          {segments.map((segment, index) => (
            <DraggableSegmentItem
              key={index}
              segment={segment}
              index={index}
              selectedIndex={selectedSegmentIndex}
              onSelect={onSelectSegment}
              onDelete={onDeleteSegment}
              moveSegment={onMoveSegment}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No segments in this block. Click "Add" to begin building your prompt.
        </Typography>
      )}
    </Box>
  );
};

export default SegmentsPanel;