import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import TerminalIcon from '@mui/icons-material/Terminal';
import BlockPreview from './BlockPreview';
import CommandPreview from './CommandPreview';
import { BlockConfig } from '../../types/BlockConfig';

export interface PreviewPanelProps {
  /**
   * The currently selected block index
   */
  selectedBlockIndex: number;
  /**
   * All blocks in the current theme
   */
  blocks: BlockConfig[];
  /**
   * Function to handle block selection from preview
   */
  onSelectBlock: (index: number) => void;
}

/**
 * Component that renders a preview of the terminal prompt
 * with options to switch between block view and terminal view
 */
const PreviewPanel: React.FC<PreviewPanelProps> = ({
  selectedBlockIndex,
  blocks,
  onSelectBlock
}) => {
  const [previewMode, setPreviewMode] = React.useState<'blocks' | 'terminal'>('blocks');

  const handlePreviewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: 'blocks' | 'terminal' | null
  ) => {
    if (newMode !== null) {
      setPreviewMode(newMode);
    }
  };

  const currentBlock = blocks[selectedBlockIndex] || {
    type: 'prompt',
    alignment: 'left',
    segments: []
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: '#1e1e1e',
        color: '#ffffff',
        minHeight: '100px',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Prompt Preview</Typography>
        <ToggleButtonGroup
          value={previewMode}
          exclusive
          onChange={handlePreviewModeChange}
          size="small"
          aria-label="preview mode"
        >
          <ToggleButton value="blocks" aria-label="blocks view">
            <ViewQuiltIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="terminal" aria-label="terminal view">
            <TerminalIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

      <Box
        sx={{
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
          }
        }}
      >
        {previewMode === 'blocks' ? (
          <BlockPreview
            block={{
              type: currentBlock.type || 'prompt',
              alignment: currentBlock.alignment as 'left' | 'right' | undefined,
              segments: currentBlock.segments || []
            }}
            isActive={true}
            onClick={() => onSelectBlock(selectedBlockIndex)}
          />
        ) : (
          <CommandPreview
            selectedBlockIndex={selectedBlockIndex}
            onSelectBlock={onSelectBlock}
          />
        )}
      </Box>
    </Paper>
  );
};

export default PreviewPanel;