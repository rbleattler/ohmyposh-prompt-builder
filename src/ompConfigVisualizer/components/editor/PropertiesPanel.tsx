import React from 'react';
import { Paper, Typography } from '@mui/material';
import BlockEditor from '../blocks/BlockEditor';
import SegmentEditor from '../segments/SegmentEditor';
import { BlockConfig } from '../../types/BlockConfig';
import { SegmentType } from '../../types/schema/segmentProps';

interface PropertiesPanelProps {
  /**
   * Currently active tab (0 for blocks, 1 for segments)
   */
  activeTab: number;
  /**
   * Currently selected block
   */
  selectedBlock?: BlockConfig;
  /**
   * Index of the currently selected block
   */
  selectedBlockIndex: number;
  /**
   * Currently selected segment
   */
  selectedSegment?: SegmentType;
  /**
   * Index of the currently selected segment
   */
  selectedSegmentIndex: number | null;
  /**
   * Handler for updating a segment
   */
  onUpdateSegment?: (index: number, segment: SegmentType) => void;
}

/**
 * Panel component that displays property editors for blocks or segments
 * based on the currently active tab and selection
 */
const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  activeTab,
  selectedBlock,
  selectedBlockIndex,
  selectedSegment,
  selectedSegmentIndex,
  onUpdateSegment
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      {activeTab === 0 ? (
        // Block Properties
        selectedBlock ? (
          <BlockEditor
            block={selectedBlock}
            blockIndex={selectedBlockIndex}
          />
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            No block selected. Add or select a block to edit its properties.
          </Typography>
        )
      ) : (
        // Segment Properties
        selectedSegmentIndex !== null && selectedSegment ? (
          <SegmentEditor
            segment={selectedSegment}
            segmentIndex={selectedSegmentIndex}
            blockIndex={selectedBlockIndex}
            onChange={onUpdateSegment ?
              (segment) => onUpdateSegment(selectedSegmentIndex, segment) :
              undefined}
          />
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            Select a segment to edit its properties or add a new segment.
          </Typography>
        )
      )}
    </Paper>
  );
};

export default PropertiesPanel;