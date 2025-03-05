import React from 'react';
import { Box, Typography } from '@mui/material';
import BlockPreview from './BlockPreview';
import { BlockConfig } from '../../types/BlockConfig';

interface CommandPreviewProps {
  blocks: BlockConfig[];
  selectedBlockIndex: number;
  onSelectBlock: (index: number) => void;
}

/**
 * Shows a command preview with input and output simulation
 */
const CommandPreview: React.FC<CommandPreviewProps> = ({
  blocks,
  selectedBlockIndex,
  onSelectBlock
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // For a more realistic preview, we'll simulate a command input and output
  return (
    <Box sx={{ width: '100%' }}>
      {/* Previous commands to show context */}
      <Box sx={{ mb: 3, opacity: 0.6 }}>
        <Box sx={{ display: 'flex', mb: 1 }}>
          <BlockPreview
            blocks={blocks}
            selectedBlockIndex={-1} // Don't highlight any blocks in the previous command
            onSelectBlock={() => {}} // No-op for previous command
          />
          <Box component="span" sx={{ ml: 1 }}>ls -la</Box>
        </Box>
        <Box sx={{ pl: 2, fontFamily: 'monospace', fontSize: '14px' }}>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            drwxr-xr-x  5 user group   4096 Nov 15 12:24 .
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            drwxr-xr-x 47 user group   4096 Nov 14 22:13 ..
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            drwxr-xr-x  8 user group   4096 Nov 15 12:24 .git
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            -rw-r--r--  1 user group    310 Nov 15 10:05 .gitignore
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            -rw-r--r--  1 user group  11357 Nov 15 12:24 LICENSE
          </Typography>
        </Box>
      </Box>

      {/* Current command prompt */}
      <Box>
        <BlockPreview
          blocks={blocks}
          selectedBlockIndex={selectedBlockIndex}
          onSelectBlock={onSelectBlock}
        />
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            width: '8px',
            height: '18px',
            backgroundColor: '#f1f1f1',
            animation: 'blink 1s step-end infinite',
            ml: 1,
            verticalAlign: 'middle',
            opacity: 0.7,
            '@keyframes blink': {
              '0%, 100%': { opacity: 0.7 },
              '50%': { opacity: 0 },
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default CommandPreview;
