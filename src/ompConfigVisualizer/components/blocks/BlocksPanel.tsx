import React from 'react';
import { Paper, Tabs, Tab, Box } from '@mui/material';
import BlockList from './BlockList';
import { BlockConfig } from '../../types/BlockConfig';

interface BlocksPanelProps {
  /**
   * Array of blocks to display
   */
  blocks: BlockConfig[];
  /**
   * Currently selected block index
   */
  selectedBlockIndex: number;
  /**
   * Current tab value
   */
  tabValue: number;
  /**
   * Handler for tab changes
   */
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  /**
   * Handler for selecting a block
   */
  onSelectBlock: (index: number) => void;
  /**
   * Handler for adding a new block
   */
  onAddBlock: () => void;
  /**
   * Handler for deleting a block
   */
  onDeleteBlock: (index: number) => void;
  /**
   * Handler for moving blocks (reordering)
   */
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
  /**
   * Segments panel to show when on the segments tab
   */
  segmentsPanel: React.ReactNode;
}

/**
 * Panel component that manages blocks and segments with tabs for switching between them
 */
const BlocksPanel: React.FC<BlocksPanelProps> = ({
  blocks,
  selectedBlockIndex,
  tabValue,
  onTabChange,
  onSelectBlock,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock,
  segmentsPanel
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        aria-label="editor tabs"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Blocks" />
        <Tab label="Segments" />
      </Tabs>

      {/* Content based on selected tab */}
      <Box
        role="tabpanel"
        hidden={tabValue !== 0}
        id="tabpanel-blocks"
        sx={{ width: '100%' }}
      >
        {tabValue === 0 && (
          <Box sx={{ pt: 2 }}>
            <BlockList
              blocks={blocks}
              selectedBlockIndex={selectedBlockIndex}
              onSelectBlock={onSelectBlock}
              onAddBlock={onAddBlock}
              onDeleteBlock={onDeleteBlock}
              onMoveBlock={onMoveBlock}
            />
          </Box>
        )}
      </Box>

      <Box
        role="tabpanel"
        hidden={tabValue !== 1}
        id="tabpanel-segments"
        sx={{ width: '100%' }}
      >
        {tabValue === 1 && (
          <Box sx={{ pt: 2 }}>
            {segmentsPanel}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BlocksPanel;