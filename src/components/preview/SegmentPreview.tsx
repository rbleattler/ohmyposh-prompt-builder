import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import { SegmentType } from '../types/SegmentProps';
import SegmentFactory from '../SegmentFactory';
import { BlockConfig } from '../../types/BlockConfig';

interface SegmentPreviewProps {
  segments: SegmentType[];
  currentBlockIndex?: number;
  blockAlignment?: string;
  blockNewline?: boolean;
}

/**
 * Component for displaying a preview of segments within a block
 */
const SegmentPreview: React.FC<SegmentPreviewProps> = ({
  segments,
  currentBlockIndex = 0,
  blockAlignment = 'left',
  blockNewline = false
}) => {
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

  // Determine the container's justification based on alignment
  const getJustification = () => {
    switch (blockAlignment) {
      case 'right':
        return 'flex-end';
      case 'center':
        return 'center';
      default:
        return 'flex-start';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'monospace',
        fontSize: '16px',
        minHeight: '32px',
        width: '100%',
        justifyContent: getJustification(),
        flexDirection: 'row',
        position: 'relative',
        mb: blockNewline ? 1 : 0
      }}
    >
      {segments.map((segment, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <SegmentFactory
            type={segment.type}
            config={segment.config}
            foreground={segment.foreground}
            background={segment.background}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SegmentPreview;
