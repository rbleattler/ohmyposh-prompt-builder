import React from 'react';
import { Box, Typography } from '@mui/material';
import SegmentPreview from './SegmentPreview';
import { BlockConfig } from '../../types/BlockConfig';

interface BlockPreviewProps {
  blocks: BlockConfig[];
  selectedBlockIndex: number;
  onSelectBlock: (index: number) => void;
}

/**
 * Component to render all blocks with proper positioning
 */
const BlockPreview: React.FC<BlockPreviewProps> = ({
  blocks,
  selectedBlockIndex,
  onSelectBlock
}) => {
  if (!blocks || blocks.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#aaa' }}>
        No blocks defined. Add a block to start building your prompt.
      </Typography>
    );
  }

  const getContainerStyles = (blockIndex: number) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    borderLeft: blockIndex === selectedBlockIndex ? '2px solid #1976d2' : '2px solid transparent',
    pl: 1,
    py: 0.5,
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    }
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {blocks.map((block, index) => (
        <Box
          key={index}
          sx={getContainerStyles(index)}
          onClick={() => onSelectBlock(index)}
        >
          {/* For newline blocks, add a visual indicator */}
          {block.alignment === 'newline' && index > 0 && (
            <Box
              sx={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                mb: 1
              }}
            />
          )}

          {block.segments && block.segments.length > 0 ? (
            <SegmentPreview
              segments={block.segments}
              currentBlockIndex={index}
              blockAlignment={block.alignment}
              blockNewline={!!block.newline}
            />
          ) : (
            <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
              Empty block - Add segments
            </Typography>
          )}

          {/* Show newline after block if specified */}
          {block.newline && (
            <Box
              sx={{
                width: '100%',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                mt: 1
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default BlockPreview;
