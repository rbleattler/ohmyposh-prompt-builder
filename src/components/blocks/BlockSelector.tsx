import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { BlockConfig } from '../../types/BlockConfig';

interface BlockSelectorProps {
  onSelect: (blockType: BlockConfig) => void;
}

/**
 * Component for selecting a block type when creating a new block
 */
const BlockSelector: React.FC<BlockSelectorProps> = ({ onSelect }) => {
  const blockTypes: { type: BlockConfig, name: string, description: string, icon: React.ReactNode }[] = [
    {
      type: { alignment: 'left', segments: [] },
      name: 'Left Aligned Block',
      description: 'Standard block aligned to the left of the prompt',
      icon: <AlignHorizontalLeftIcon />
    },
    {
      type: { alignment: 'right', segments: [] },
      name: 'Right Aligned Block',
      description: 'Block aligned to the right side of the terminal',
      icon: <AlignHorizontalRightIcon />
    },
    {
      type: { alignment: 'newline', segments: [], newline: true },
      name: 'Newline Block',
      description: 'Block that starts on a new line',
      icon: <KeyboardReturnIcon />
    }
  ];

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Add Block</Typography>
        <Typography variant="body2" color="textSecondary">
          Select a block type to add to your prompt
        </Typography>
      </Box>

      <Divider />

      <List sx={{ py: 0 }}>
        {blockTypes.map((blockType, index) => (
          <ListItem
            button
            key={index}
            onClick={() => onSelect(blockType.type)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(66, 165, 245, 0.08)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{blockType.icon}</ListItemIcon>
            <ListItemText
              primary={blockType.name}
              secondary={blockType.description}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BlockSelector;
