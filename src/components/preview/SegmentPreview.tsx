import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import { SegmentType } from '../types/SegmentProps';
import DraggableSegment from './DraggableSegment';

interface SegmentPreviewProps {
  segments: SegmentType[];
  currentBlockIndex?: number;
}

const SegmentPreview: React.FC<SegmentPreviewProps> = ({ segments, currentBlockIndex = 0 }) => {
  const { theme, updateTheme } = useThemeContext();

  // Handle moving segments through drag and drop
  const moveSegment = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!theme || !theme.blocks) return;

    // Create a copy of the current blocks
    const updatedBlocks = [...theme.blocks];

    // Get the current block's segments
    const blockSegments = [...updatedBlocks[currentBlockIndex].segments];

    // Reorder the segments
    const [movedSegment] = blockSegments.splice(dragIndex, 1);
    blockSegments.splice(hoverIndex, 0, movedSegment);

    // Update the block with the reordered segments
    updatedBlocks[currentBlockIndex] = {
      ...updatedBlocks[currentBlockIndex],
      segments: blockSegments
    };

    // Update the theme
    updateTheme({
      ...theme,
      blocks: updatedBlocks
    });
  }, [theme, updateTheme, currentBlockIndex]);

  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'monospace',
        fontSize: '16px',
        minHeight: '32px',
        overflowX: 'auto',
        width: '100%',
        py: 1,
      }}
    >
      {segments.map((segment, index) => (
        <DraggableSegment
          key={index}
          segment={segment}
          index={index}
          moveSegment={moveSegment}
        />
      ))}
    </Box>
  );
};

export default SegmentPreview;
