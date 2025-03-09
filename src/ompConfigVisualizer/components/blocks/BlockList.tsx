import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  Button,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BlockConfig } from '../../types/BlockConfig';
import DraggableBlockItem from './DraggableBlockItem';

interface BlockListProps {
  blocks: BlockConfig[];
  selectedBlockIndex: number;
  onSelectBlock: (index: number) => void;
  onAddBlock: () => void;
  onDeleteBlock: (index: number) => void;
  onMoveBlock?: (dragIndex: number, hoverIndex: number) => void;
}

/**
 * Component for displaying and managing blocks in the visual editor
 */
const BlockList: React.FC<BlockListProps> = ({
  blocks,
  selectedBlockIndex,
  onSelectBlock,
  onAddBlock,
  onDeleteBlock,
  onMoveBlock
}) => {
  // Default moveBlock handler if not provided
  const moveBlock = onMoveBlock || ((dragIndex: number, hoverIndex: number) => {
    console.warn('Block reordering is not implemented');
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Blocks</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddBlock}
        >
          Add Block
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {blocks.length > 0 ? (
        <List component={Paper} elevation={0} sx={{ bgcolor: 'background.paper' }}>
          {blocks.map((block, index) => (
            <DraggableBlockItem
              key={index}
              block={block}
              index={index}
              selectedIndex={selectedBlockIndex}
              onSelectBlock={onSelectBlock}
              onDeleteBlock={onDeleteBlock}
              moveBlock={moveBlock}
            />
          ))}
        </List>
      ) : (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            No blocks created yet. Click "Add Block" to create your first block.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BlockList;